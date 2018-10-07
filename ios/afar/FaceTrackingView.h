#import <React/RCTView.h>
#import <ARKit/ARKit.h>

@interface FaceTrackingView : ARSCNView <ARSCNViewDelegate>

@property(nonatomic, copy) RCTBubblingEventBlock onDistanceChange;

@end
