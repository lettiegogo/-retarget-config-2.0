export interface RetargetConfig {
  scenario?: 'unredeemed' | 'redeemed';
  couponIds?: string[];
  touchTimeType?: 'fixed' | 'dynamic' | 'immediate' | 'afterHours';
  touchTimeValue?: number;
  touchTimeFixed?: string;
  actionType?: ('reward' | 'message')[];
  actionConfig?: Record<string, string>;
}

export const mockCanvasName = '智能触达画布';

export const mockCoupons = [
  { label: '满100减20优惠券', value: 'coupon_001' },
  { label: '满200减50优惠券', value: 'coupon_002' },
  { label: '新人专享8折券', value: 'coupon_003' },
];

export const mockRetargetConfig: RetargetConfig = {
  scenario: 'unredeemed',
  couponIds: ['coupon_001', 'coupon_002'],
  touchTimeType: 'dynamic',
  touchTimeValue: 24,
  actionType: ['reward'],
  actionConfig: { rewardType: 'points', amount: '100' },
};

export const mockNodes = [
  { id: 'target', label: '目标人群', status: 'done', icon: 'target' },
  { id: 'enter', label: '进入事件', status: 'done', icon: 'event' },
  { id: 'strategy', label: '① 分流策略', status: 'process', icon: 'strategy' },
  { id: 'action', label: '执行动作', status: 'wait', icon: 'action' },
];
