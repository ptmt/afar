#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <ARKit/ARKit.h>
#import <React/RCTViewManager.h>

@interface FaceTrackingViewManager : RCTViewManager
@end

@interface FaceTrackerModule : RCTEventEmitter <RCTBridgeModule, ARSessionDelegate, ARSCNViewDelegate>
@end
