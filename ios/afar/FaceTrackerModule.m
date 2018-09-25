#import "FaceTrackerModule.h"
#import <SceneKit/SceneKit.h>
#import <ARKit/ARKit.h>

NSString* const kDistanceChange = @"onDistanceChange";

@implementation FaceTrackerModule {
  ARSession API_AVAILABLE(ios(11.0)) *session;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[kDistanceChange];
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (NSDictionary<NSString *, id> *)constantsToExport
{
  if (@available(iOS 11.0, *)) {
    return @{
             @"isSupported": @( ARFaceTrackingConfiguration.isSupported)
             };
  } else {
    return @{
             @"isSupported": @(false)
             };
  }
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(startTracking) {
  if (@available(iOS 11.0, *)) {
    ARFaceTrackingConfiguration* configuration = [[ARFaceTrackingConfiguration alloc] init];
    [configuration setLightEstimationEnabled:YES];
    session = [[ARSession alloc] init];
    [session runWithConfiguration:configuration];
    session.delegate = self;
    // session.run(configuration, options: [.resetTracking, .removeExistingAnchors])
  } else {
    // Fallback on earlier versions
  }
  
}

- (void)session:(ARSession *)session didAddAnchors:(NSArray<ARAnchor*>*)anchors  API_AVAILABLE(ios(11.0)){
  NSLog(@"didAddArnchors %@", anchors);
  if (anchors.count > 0) {
    ARFaceAnchor *face = (ARFaceAnchor*)anchors[1];
    
    
  }
}

//- (void)session:(ARSession *)session didUpdateAnchors:(NSArray<ARAnchor*>*)anchors  API_AVAILABLE(ios(11.0)){
//  NSLog(@"didUpdateArnchors %@", anchors);
//
//}

- (void)session:(ARSession *)session didRemoveAnchors:(NSArray<ARAnchor*>*)anchors  API_AVAILABLE(ios(11.0)) {
   NSLog(@"didUpdateArnchors %@", anchors);
}

RCT_EXPORT_METHOD(stopTracking) {
  session = nil;
}
//
//#pragma mark - <EVFaceTrackerDelegate>
//// This delegate method is called every time the face recognition has detected something (including change)
//- (void)faceIsTracked:(CGRect)faceRect withOffsetWidth:(float)offsetWidth andOffsetHeight:(float)offsetHeight andDistance:(float) distance {
//  NSLog(@"distance %f offsetWidth %f offsetHeight %f faceRect %f", distance, offsetWidth, offsetHeight, faceRect.size.width);
//  [self sendEventWithName:kDistanceChange body:@{@"distance": @(distance) }];
//}
//
//// When the fluidUpdateInterval method is called, then this delegate method will be called on a regular interval
//- (void)fluentUpdateDistance:(float)distance {
//  
//  NSLog(@"fluentUpdateDistance %f", distance);
//  
//}

@end
