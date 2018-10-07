#import <React/RCTView.h>
#import <ARKit/ARKit.h>
#import "FaceTrackingView.h"
@implementation FaceTrackingView

-(instancetype)init {
  if ((self = [super init])) {
    
    self.delegate = self;
    
    if (@available(iOS 11.0, *)) {
      ARFaceTrackingConfiguration* configuration = [[ARFaceTrackingConfiguration alloc] init];
      [configuration setLightEstimationEnabled:YES];
      [configuration setWorldAlignment:ARWorldAlignmentGravityAndHeading];
      ARSession *session = self.session;
      
      [session runWithConfiguration:configuration options:ARSessionRunOptionResetTracking & ARSessionRunOptionRemoveExistingAnchors];
      SCNScene *scene = [SCNScene new];
      self.scene = scene;
    } else {
      // Fallback on earlier versions
    }
    
    
    
  }
  return self;
}

- (void)renderer:(id <SCNSceneRenderer>)renderer didUpdateNode:(SCNNode *)node forAnchor:(ARAnchor *)anchor  API_AVAILABLE(ios(11.0)){
  SCNNode *faceNode = node;
  // SCNVector3 pos = SCNVector3Make(0, 0, 0);
  SCNVector3 pos1 = faceNode.worldPosition;
  SCNVector3 distance = [faceNode convertPosition:pos1 toNode:[self pointOfView]];

  float d = sqrtf(distance.x * distance.x + distance.y * distance.y + distance.z * distance.z);
  NSLog(@"DEBUG: didUpdateNode d %f (%f %f %f)", round(d*100), faceNode.worldPosition.x, faceNode.worldPosition.y, faceNode.worldPosition.z);
  
  self.onDistanceChange(@{@"distance": @(d)});
}

- (void)session:(ARSession *)session didRemoveAnchors:(NSArray<ARAnchor*>*)anchors  API_AVAILABLE(ios(11.0)) {
  self.onDistanceChange(@{@"distance": @(0)});
}

@end
