#pragma strict
#pragma implicit
#pragma downcast

var boxcollider:boolean=true;
var splitonce:boolean=true;
var particle:GameObject;

private var daxra:Vector3;
private var hitpoint1:Vector3;
private var hitpoint2:Vector3;
private var primitive:boolean=true;
private var closestpoint2:Vector3;
private var hitedmesh : Mesh;
private var hitedvertices  : Vector3[];

function OnTriggerEnter(other2:Collider){
hitpoint1 =  other2.GetComponent.<Collider>().ClosestPointOnBounds(transform.position); 
hitedmesh = other2.GetComponent.<MeshFilter>().mesh;
hitedvertices = hitedmesh.vertices;
}

function OnTriggerExit(other : Collider){
		hitpoint2 = other.GetComponent.<Collider>().ClosestPointOnBounds(transform.position);
		if(other.gameObject.tag !="splitted"){
			if(other.gameObject.tag=="primitive"){
				primitive=true;
				}else{
					primitive=false;
				}
				
					var closestpoint : Vector3 = other.ClosestPointOnBounds(transform.position);
					Instantiate(particle, closestpoint, Quaternion.identity);
				
						var clone : GameObject = other.transform.gameObject;
						var newobject : GameObject = Instantiate (clone, other.transform.position, other.transform.rotation) as GameObject;
						
						var newmesh : Mesh = newobject.GetComponent.<MeshFilter>().mesh; 
						var newvertices : Vector3[] = newmesh.vertices;
						daxra = Vector3.Cross((hitpoint1 - hitpoint2).normalized, Vector3(0,0,1));  
						var splitter = Plane(daxra,(hitpoint1 + hitpoint2)/2);
						
						if(primitive){
							for (i=0; i < newvertices.Length; i++)
							{
								if(splitter.GetSide(newobject.gameObject.transform.TransformPoint(newvertices[i]))){
								newvertices[i] =  newobject.transform.InverseTransformPoint(newobject.transform.TransformPoint(newvertices[i]) - splitter.GetDistanceToPoint(newobject.transform.TransformPoint(newvertices[i])) * splitter.normal);
								}else{
								hitedvertices[i] =  other.transform.InverseTransformPoint(other.transform.TransformPoint(hitedvertices[i]) - splitter.GetDistanceToPoint(other.transform.TransformPoint(hitedvertices[i])) * splitter.normal);
								}
							}
						}else{
							for (i=0; i < newvertices.Length; i++)
							{
								if(splitter.GetSide(newobject.gameObject.transform.TransformPoint(newvertices[i]))){
								newvertices[i] = newobject.transform.InverseTransformPoint((hitpoint1 + hitpoint2)/2);
								}else{
								hitedvertices[i] = other.transform.InverseTransformPoint((hitpoint1 + hitpoint2)/2);
								}
							}
						}	
						
						newmesh.vertices = newvertices;
						newmesh.RecalculateBounds();
						hitedmesh.vertices = hitedvertices;
						hitedmesh.RecalculateBounds();
						
						if(newobject.GetComponent.<MeshCollider>() && !boxcollider){
						newobject.GetComponent.<MeshCollider>().sharedMesh=newmesh;
						newobject.GetComponent.<MeshCollider>().convex=true;
						other.GetComponent.<MeshCollider>().sharedMesh = hitedmesh;
						other.GetComponent.<MeshCollider>().convex=true;
						}
						
						if(newobject.GetComponent.<MeshCollider>() && boxcollider){
							Destroy(newobject.GetComponent.<MeshCollider>());
							newobject.AddComponent.<BoxCollider>();
							Destroy(other.GetComponent.<Collider>().GetComponent.<MeshCollider>());
							other.GetComponent.<Collider>().gameObject.AddComponent.<BoxCollider>();	
						}
						
						if(newobject.GetComponent.<BoxCollider>() && boxcollider){
							newobject.GetComponent.<BoxCollider>().size=newmesh.bounds.size;
							newobject.GetComponent.<BoxCollider>().center=newmesh.bounds.center;
							if(newobject.GetComponent.<BoxCollider>().size.y <= 0.01){
							Destroy(newobject);
							}
							other.GetComponent.<Collider>().GetComponent.<BoxCollider>().size= hitedmesh.bounds.size;
							other.GetComponent.<Collider>().GetComponent.<BoxCollider>().center=hitedmesh.bounds.center;
							if(other.GetComponent.<Collider>().GetComponent.<BoxCollider>().size.y <= 0.01){
							Destroy(other.GetComponent.<Collider>().gameObject);
							}
						}
						
						if(newobject.GetComponent.<BoxCollider>() && !boxcollider){
							Destroy(newobject.GetComponent.<BoxCollider>());
							newobject.AddComponent.<MeshCollider>();
							newobject.GetComponent.<Collider>().GetComponent.<MeshCollider>().sharedMesh = newmesh;
							newobject.GetComponent.<Collider>().GetComponent.<MeshCollider>().convex=true;
							Destroy(other.GetComponent.<Collider>().GetComponent.<BoxCollider>());
							other.GetComponent.<Collider>().gameObject.AddComponent.<MeshCollider>();
							other.GetComponent.<Collider>().GetComponent.<MeshCollider>().sharedMesh = hitedmesh;
							other.GetComponent.<Collider>().GetComponent.<MeshCollider>().convex=true;
						}
						
						
						if(newobject.GetComponent.<SphereCollider>() && !boxcollider){
							Destroy(newobject.GetComponent.<SphereCollider>());
							newobject.AddComponent.<MeshCollider>();
							newobject.GetComponent.<Collider>().GetComponent.<MeshCollider>().sharedMesh = newmesh;
							newobject.GetComponent.<Collider>().GetComponent.<MeshCollider>().convex=true;
							Destroy(other.GetComponent.<Collider>().GetComponent.<SphereCollider>());
							other.GetComponent.<Collider>().gameObject.AddComponent.<MeshCollider>();
							other.GetComponent.<Collider>().GetComponent.<MeshCollider>().sharedMesh = hitedmesh;
							other.GetComponent.<Collider>().GetComponent.<MeshCollider>().convex=true;
						}
						
						if(newobject.GetComponent.<SphereCollider>() && boxcollider){
							Destroy(newobject.GetComponent.<SphereCollider>());
							newobject.AddComponent.<BoxCollider>();
							newobject.GetComponent.<BoxCollider>().size=newmesh.bounds.size;
							newobject.GetComponent.<BoxCollider>().center=newmesh.bounds.center;
							if(newobject.GetComponent.<BoxCollider>().size.y <= 0.01){
							Destroy(newobject);
							}
							Destroy(other.GetComponent.<Collider>().GetComponent.<SphereCollider>());
							other.GetComponent.<Collider>().gameObject.AddComponent.<BoxCollider>();
							other.GetComponent.<Collider>().GetComponent.<BoxCollider>().size= hitedmesh.bounds.size;
							other.GetComponent.<Collider>().GetComponent.<BoxCollider>().center=hitedmesh.bounds.center;
							if(other.GetComponent.<Collider>().GetComponent.<BoxCollider>().size.y <= 0.01){
							Destroy(other.GetComponent.<Collider>().gameObject);
							}
						}
						
						if(newobject.GetComponent.<CapsuleCollider>() && boxcollider){
							Destroy(newobject.GetComponent.<CapsuleCollider>());
							newobject.AddComponent.<BoxCollider>();
							newobject.GetComponent.<BoxCollider>().size= hitedmesh.bounds.size;
							newobject.GetComponent.<BoxCollider>().center=hitedmesh.bounds.center;
							if(newobject.GetComponent.<BoxCollider>().size.y <= 0.01){
							Destroy(newobject);
							}
							Destroy(other.GetComponent.<Collider>().GetComponent.<CapsuleCollider>());
							other.GetComponent.<Collider>().gameObject.AddComponent.<BoxCollider>();
							other.GetComponent.<Collider>().GetComponent.<BoxCollider>().size= hitedmesh.bounds.size;
							other.GetComponent.<Collider>().GetComponent.<BoxCollider>().center=hitedmesh.bounds.center;
							if(other.GetComponent.<Collider>().GetComponent.<BoxCollider>().size.y <= 0.01){
							Destroy(other.GetComponent.<Collider>().gameObject);
							}
						}
						
						if(newobject.GetComponent.<CapsuleCollider>()&& !boxcollider){
							Destroy(newobject.GetComponent.<CapsuleCollider>());
							newobject.AddComponent.<MeshCollider>();
							newobject.GetComponent.<Collider>().GetComponent.<MeshCollider>().sharedMesh = newmesh;
							newobject.GetComponent.<Collider>().GetComponent.<MeshCollider>().convex=true;
							Destroy(other.GetComponent.<Collider>().GetComponent.<CapsuleCollider>());
							other.GetComponent.<Collider>().gameObject.AddComponent.<MeshCollider>();
							other.GetComponent.<Collider>().GetComponent.<MeshCollider>().sharedMesh = hitedmesh;
							other.GetComponent.<Collider>().GetComponent.<MeshCollider>().convex=true;
						}
						
							if(splitonce){
							newobject.gameObject.tag="splitted";
							other.GetComponent.<Collider>().gameObject.tag="splitted";
						}
						
						if(!newobject.GetComponent.<Rigidbody>()){
							newobject.AddComponent.<Rigidbody>();
							other.GetComponent.<Collider>().gameObject.AddComponent.<Rigidbody>();
						}

			}
	}