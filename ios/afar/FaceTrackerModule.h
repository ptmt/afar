#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "EVFaceTracker.h"

@interface FaceTrackerModule : RCTEventEmitter <RCTBridgeModule, EVFaceTrackerDelegate>
@end
