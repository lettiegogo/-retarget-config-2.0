// 任务奖励统计 - 券维度数据
export interface RewardStat {
  id: number
  couponCode: string
  couponName: string
  allocatedCount: number
  sentCount: number
  remainingCount: number
  sentRatio: string
  stage: 'first' | 'second' // 触达阶段
  scenario?: 'unredeemed' | 'redeemed' // 二次触达场景
  splitName?: string // 分流名称
  retargetName?: string // 二次触达名称
}

export const mockRewardStats: RewardStat[] = [
  {
    id: 1,
    couponCode: '335',
    couponName: '生椰拿铁馥芮5折券',
    allocatedCount: 3559,
    sentCount: 3559,
    remainingCount: 0,
    sentRatio: '100.0%',
    stage: 'first',
  },
  {
    id: 2,
    couponCode: '336',
    couponName: '满200减50券',
    allocatedCount: 1200,
    sentCount: 856,
    remainingCount: 344,
    sentRatio: '71.3%',
    stage: 'second',
    scenario: 'unredeemed',
    retargetName: '未核销召回发券',
  },
  {
    id: 3,
    couponCode: '337',
    couponName: '新品尝鲜立减10元券',
    allocatedCount: 800,
    sentCount: 620,
    remainingCount: 180,
    sentRatio: '77.5%',
    stage: 'second',
    scenario: 'redeemed',
    retargetName: '核销后复购激励',
  },
]

// 分流选项
export const splitOptions = [
  '下单上海门店咖啡',
  '下单北京门店咖啡',
]

// 二次触达名称选项（从配置中获取）
export const retargetNameOptions = [
  '未核销召回发券',
  '核销后复购激励',
]

// 参与记录
export interface ParticipationRecord {
  id: number
  userId: string
  nickname: string
  phone: string
  splitName: string
  isControl: string
  behaviorCompleteTime: string
  taskCompleteTime: string
  giftSendStatus: string
  giftSendTime: string
  messageSendStatus: string
  messageSendTime: string
  stage: 'first' | 'second' // 触达阶段
  scenario?: 'unredeemed' | 'redeemed' // 二次触达场景（仅二次触达时有值）
  redeemStatus?: 'redeemed' | 'unredeemed' // 核销状态（仅二次触达时有值）
  secondTouchTime?: string // 二次触达时间
  secondTouchResult?: string // 二次触达结果
  retargetName?: string // 二次触达名称（仅二次触达时有值）
}

export const mockParticipationRecords: ParticipationRecord[] = [
  {
    id: 1,
    userId: '7106368268750825996',
    nickname: '',
    phone: '13641801129',
    splitName: '',
    isControl: '否',
    behaviorCompleteTime: '2026-04-15 01:44:36',
    taskCompleteTime: '2026-04-15 01:44:36',
    giftSendStatus: '已领取',
    giftSendTime: '2026-04-15 01:44:35',
    messageSendStatus: '未发放',
    messageSendTime: '',
    stage: 'first',
  },
  {
    id: 2,
    userId: '801665895031655429',
    nickname: '',
    phone: '17521135446',
    splitName: '',
    isControl: '否',
    behaviorCompleteTime: '2026-04-15 05:53:31',
    taskCompleteTime: '2026-04-15 05:53:31',
    giftSendStatus: '已领取',
    giftSendTime: '2026-04-15 05:53:30',
    messageSendStatus: '未发放',
    messageSendTime: '',
    stage: 'first',
  },
  {
    id: 3,
    userId: '166747505077132416',
    nickname: '',
    phone: '13361976115',
    splitName: '',
    isControl: '否',
    behaviorCompleteTime: '2026-04-15 06:11:45',
    taskCompleteTime: '2026-04-15 06:11:45',
    giftSendStatus: '已领取',
    giftSendTime: '2026-04-15 06:11:45',
    messageSendStatus: '未发放',
    messageSendTime: '',
    stage: 'first',
  },
  {
    id: 4,
    userId: '714654638266334260',
    nickname: '',
    phone: '1801719691',
    splitName: '',
    isControl: '否',
    behaviorCompleteTime: '2026-04-15 08:30:00',
    taskCompleteTime: '2026-04-15 08:30:00',
    giftSendStatus: '已领取',
    giftSendTime: '2026-04-15 08:30:00',
    messageSendStatus: '未发放',
    messageSendTime: '',
    stage: 'first',
  },
  // 二次触达 - 领券未核销场景
  {
    id: 5,
    userId: '92012345678901234',
    nickname: '张三',
    phone: '13800138001',
    splitName: '',
    isControl: '否',
    behaviorCompleteTime: '2026-04-14 10:00:00',
    taskCompleteTime: '2026-04-14 10:00:00',
    giftSendStatus: '已领取',
    giftSendTime: '2026-04-14 10:00:00',
    messageSendStatus: '已发放',
    messageSendTime: '2026-04-15 10:00:00',
    stage: 'second',
    scenario: 'unredeemed',
    redeemStatus: 'unredeemed',
    secondTouchTime: '2026-04-15 10:00:00',
    secondTouchResult: '执行成功',
    retargetName: '未核销召回发券',
  },
  {
    id: 6,
    userId: '92012345678901235',
    nickname: '李四',
    phone: '13800138002',
    splitName: '',
    isControl: '否',
    behaviorCompleteTime: '2026-04-14 12:00:00',
    taskCompleteTime: '2026-04-14 12:00:00',
    giftSendStatus: '已领取',
    giftSendTime: '2026-04-14 12:00:00',
    messageSendStatus: '已跳过',
    messageSendTime: '-',
    stage: 'second',
    scenario: 'unredeemed',
    redeemStatus: 'redeemed',
    secondTouchTime: '-',
    secondTouchResult: '已跳过-用户已核销',
    retargetName: '未核销召回发券',
  },
  // 二次触达 - 领券已核销场景
  {
    id: 7,
    userId: '92012345678901236',
    nickname: '王五',
    phone: '13800138003',
    splitName: '',
    isControl: '否',
    behaviorCompleteTime: '2026-04-14 14:00:00',
    taskCompleteTime: '2026-04-14 14:30:00',
    giftSendStatus: '已领取',
    giftSendTime: '2026-04-14 14:00:00',
    messageSendStatus: '已发放',
    messageSendTime: '2026-04-14 16:30:00',
    stage: 'second',
    scenario: 'redeemed',
    redeemStatus: 'redeemed',
    secondTouchTime: '2026-04-14 16:30:00',
    secondTouchResult: '执行成功',
    retargetName: '核销后复购激励',
  },
  {
    id: 8,
    userId: '92012345678901237',
    nickname: '赵六',
    phone: '13800138004',
    splitName: '',
    isControl: '否',
    behaviorCompleteTime: '2026-04-14 16:00:00',
    taskCompleteTime: '2026-04-14 16:20:00',
    giftSendStatus: '已领取',
    giftSendTime: '2026-04-14 16:00:00',
    messageSendStatus: '执行中',
    messageSendTime: '-',
    stage: 'second',
    scenario: 'redeemed',
    redeemStatus: 'redeemed',
    secondTouchTime: '2026-04-14 18:20:00',
    secondTouchResult: '执行中',
    retargetName: '核销后复购激励',
  },
]
