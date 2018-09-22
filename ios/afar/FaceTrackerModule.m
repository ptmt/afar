#import "FaceTrackerModule.h"

NSString* const kDistanceChange = @"onDistanceChange";

@implementation FaceTrackerModule {
  EVFaceTracker *evFaceTracker;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[kDistanceChange];
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(startTracking) {
  // Start tracking your face.
  evFaceTracker = [[EVFaceTracker alloc] initWithDelegate:self];
  // And give us a smooth update 20 times per second.
  [evFaceTracker fluidUpdateInterval:0.05f withReactionFactor:0.3f];
}

RCT_EXPORT_METHOD(stopTracking) {
  evFaceTracker = nil;
}

#pragma mark - <EVFaceTrackerDelegate>
// This delegate method is called every time the face recognition has detected something (including change)
- (void)faceIsTracked:(CGRect)faceRect withOffsetWidth:(float)offsetWidth andOffsetHeight:(float)offsetHeight andDistance:(float) distance {
  [self sendEventWithName:kDistanceChange body:@{@"distance": @(distance) }];
}

// When the fluidUpdateInterval method is called, then this delegate method will be called on a regular interval
- (void)fluentUpdateDistance:(float)distance {
  
  NSLog(@"fluentUpdateDistance %f", distance);
  
}

@end
