#import "FaceTrackerModule.h"
#import <SceneKit/SceneKit.h>
#import <ARKit/ARKit.h>
#import <React/RCTRootView.h>
#import "FaceTrackingView.h"

@implementation FaceTrackingViewManager 

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(onDistanceChange, RCTBubblingEventBlock)

- (UIView *)view
{
  if (@available(iOS 11.0, *)) {
    return [[FaceTrackingView alloc] init];
  } else {
    return [[UIView alloc] init];
  }
}

@end

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


@end
