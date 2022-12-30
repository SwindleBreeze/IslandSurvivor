import { vec3, mat4 } from "../../../../lib/gl-matrix-module.js";
import { Player } from "../objects/Player.js";
export class CollisionController {
    constructor(game) {
        this.game = game;
        this.interactibles = {}
        this.levels = {}
        this.shouldUpdate = true;
    }

    init (player, camera) {
        this.player = player;
        this.camera = camera;
        console.log(this.game.scene)
    }

    checkCollision(a,b) {
        return (
            a.node.translation[0] - a.node.scale[0] <= b.translation[0] + b.scale[0] &&
            a.node.translation[0] + a.node.scale[0] >= b.translation[0] - b.scale[0] &&
            a.node.translation[1] - a.node.scale[1] <= b.translation[1] + b.scale[1] &&
            a.node.translation[1] + a.node.scale[1] >= b.translation[1] - b.scale[1] &&
            a.node.translation[2] - a.node.scale[2] <= b.translation[2] + b.scale[2] &&
            a.node.translation[2] + a.node.scale[2] >= b.translation[2] - b.scale[2]
        );
    }

    raycast(ray, mesh) {
        let rayOrigin = ray.origin
        let rayDirection = ray.direction

        let inverseTransform = mat4.create();
        let localRayOrigin = vec3.create();
        let localRayDirection = vec3.create();
      
        if (mesh.matrix) {
          // Calculate the inverse transformation matrix for the mesh
          inverseTransform = mat4.invert(mat4.create(), mesh.matrix);
      
          // Transform the ray origin and direction into the local space of the mesh
          localRayOrigin = vec3.transformMat4(vec3.create(), rayOrigin, inverseTransform);
          localRayDirection = vec3.transformMat4(vec3.create(), rayDirection, inverseTransform);
        } 
        else 
        {
          // If the mesh has no transformation matrix, use the ray origin and direction as-is
          localRayOrigin = vec3.clone(rayOrigin);
          localRayDirection = vec3.clone(rayDirection);
        }

        for (const primitive of mesh.primitives) {
            const indicesAccessor = primitive.indices;
            const attributes = primitive.attributes;
        
            // Retrieve the position attribute for the primitive
            const positionAttribute = attributes.POSITION;
            const bufferView = positionAttribute.bufferView;
            const byteOffset = positionAttribute.byteOffset || 0;
            const componentType = positionAttribute.componentType;
            const count = positionAttribute.count;
            const max = positionAttribute.max;
            const min = positionAttribute.min;

            // Convert the raw vertex data in the bufferView into an array of vec3 objects
            const positions = [];
            const data = new Uint8Array(bufferView.buffer, bufferView.byteOffset + byteOffset, count * 3);
            
            switch (componentType) {
                case 5126: // Float
                    for (let i = 0; i < data.length; i += 3) 
                    {
                        const x = data[i] / (max[0] - min[0]) * 2 - 1;
                        const y = data[i + 1] / (max[1] - min[1]) * 2 - 1;
                        const z = data[i + 2] / (max[2] - min[2]) * 2 - 1;
                        positions.push(vec3.fromValues(x, y, z));
                    }
                    break;
                case 5123: // Unsigned short
                    for (let i = 0; i < data.length; i += 3)
                    {
                        const x = data[i] / (max[0] - min[0]) * 2 - 1;
                        const y = data[i + 1] / (max[1] - min[1]) * 2 - 1;
                        const z = data[i + 2] / (max[2] - min[2]) * 2 - 1;
                        positions.push(vec3.fromValues(x, y, z));
                    }
                    break;
                default:
                    console.warn(`Unsupported component type: ${componentType}`);
                    break;
            }

            const indices = [];
            const indexData = new Uint8Array(indicesAccessor.bufferView.buffer, indicesAccessor.bufferView.byteOffset + indicesAccessor.byteOffset, indicesAccessor.count);
            switch (indicesAccessor.componentType) {
              case 5123: // Unsigned short
                for (let i = 0; i < indexData.length; i += 2) {
                  indices.push(indexData[i] | (indexData[i + 1] << 8));
                }
                break;
              case 5125: // Unsigned int
                for (let i = 0; i < indexData.length; i += 4) {
                  indices.push(indexData[i] | (indexData[i + 1] << 8) | (indexData[i + 2] << 16) | (indexData[i + 3] << 24));
                }
                break;
              default:
                console.warn(`Unsupported component type: ${indicesAccessor.componentType}`);
                break;
            }

            for (let i = 0; i < indices.length; i += 3) {
                const v0 = positions[indices[i]];
                const v1 = positions[indices[i + 1]];
                const v2 = positions[indices[i + 2]];
                // console.log(v0+", "+v1+", "+v2);
                const intersection = this.intersectTriangle(localRayOrigin, localRayDirection, v0, v1, v2);
                if (intersection) {
                    if (mesh.matrix) 
                    {
                        return vec3.transformMat4(vec3.create(), intersection, mesh.matrix);
                    } else {
                        // If the mesh has no transformation matrix, return the intersection point as-is
                        return intersection;
                    }
                }
            }
        }
        return null;
    }
    
    intersectTriangle(rayOrigin, rayDirection, v0, v1, v2) 
    {

        // Calculate the normal vector of the triangle
        const normal = vec3.normalize(vec3.create(),vec3.cross(vec3.create(), vec3.subtract(vec3.create(), v1, v0), vec3.subtract(vec3.create(), v2, v0)));

        // Calculate the distance from the ray origin to the plane of the triangle
        const distance = vec3.dot(normal, vec3.subtract(vec3.create(), v0, rayOrigin)) / vec3.dot(normal, rayDirection);
        if (distance < 0 || !isFinite(distance)) 
        {
          return null;
        }
        if(vec3.dot(normal, rayDirection) == 0)
        {
            return null;
        }
      
        // Calculate the intersection point of the ray with the plane of the triangle
        const intersection = vec3.add(vec3.create(), rayOrigin, vec3.scale(vec3.create(), rayDirection, distance));

        // Check if the intersection point is inside the triangle
        const edge0 = vec3.subtract(vec3.create(), v1, v0);
        const edge1 = vec3.subtract(vec3.create(), v2, v1);
        const edge2 = vec3.subtract(vec3.create(), v0, v2);
        const edgeNormal0 = vec3.cross(vec3.create(), edge0, vec3.subtract(vec3.create(), intersection, v0));
        const edgeNormal1 = vec3.cross(vec3.create(), edge1, vec3.subtract(vec3.create(), intersection, v1));
        const edgeNormal2 = vec3.cross(vec3.create(), edge2, vec3.subtract(vec3.create(), intersection, v2));
        if (vec3.dot(normal, edgeNormal0) < 0 || vec3.dot(normal, edgeNormal1) < 0 || vec3.dot(normal, edgeNormal2) < 0) {
            // The intersection point is outside the triangle, so there is no intersection
            return null;
        }

        // If the intersection point is inside the triangle, return it
            return intersection;
    }

    update() {
        this.camera.canMove = true
        
        for (let node of this.game.scene.nodes)
        {
            if(node.name.startsWith("Sand"))
            {
                console.log(node)
            }
            if(node != null && node.name != "Player" && node.name!="WGTS_rig" && node.name!="Plane"){
                let collision = this.checkCollision(this.player, node)
                if(collision){
                    console.log(node.name)
                    this.player.collision = true
                    if(this.player.prevPos != null)
                    {
                        this.player.node.translation = this.player.prevPos
                        this.camera.translation = this.camera.prevPos
                        this.camera.canMove = false
                    }
                }
                if(collision && node.name.startsWith("TreeStump"))
                {
                    this.player.canChop = true;
                    this.player.chopTarget = node
                    this.interactibles[node.name] = true;
                }
                else if(!collision && node.name.startsWith("TreeStump"))
                {
                    this.interactibles[node.name] = false;
                }
            }
        }

    }


}