#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <ARKit/ARKit.h>

@interface FaceTrackerModule : RCTEventEmitter <RCTBridgeModule, ARSessionDelegate, ARSCNViewDelegate>
@end
