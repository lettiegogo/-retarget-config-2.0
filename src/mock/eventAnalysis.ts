// 基础信息
export interface CampaignBasicInfo {
  name: string
  type: string
  targetBehavior: string
  canvasType: string
  canvasId: string
  taskStartDate: string
  taskEndDate: string
  campaignPurpose: string
  hasRetarget: boolean // 是否配置二次触达
  retargetNames: string[] // 二次触达名称列表
}

export const mockCampaignInfo: CampaignBasicInfo = {
  name: '苏皖消费返9.9元双球冰淇淋红茶',
  type: '运营营销',
  targetBehavior: '该画布未配置目标行为',
  canvasType: '触发型',
  canvasId: '3497019399390545920',
  taskStartDate: '2026/04/01 00:00:00',
  taskEndDate: '2026/04/08 23:59:59',
  campaignPurpose: '提频',
  hasRetarget: true,
  retargetNames: ['未核销召回发券', '核销后复购激励'],
}

// 核心指标
export interface CoreMetrics {
  canvasCoverageUsers: number
  newUserCount: number
  verifyOrderRate: string
  couponSentCount: number
  introducedGMV: string
  couponVerifyRate: string
  introducedGMVValue: number
  introducedOrderAvgPrice: number
}

export const mockCoreMetrics: CoreMetrics = {
  canvasCoverageUsers: 283076,
  newUserCount: 3186,
  verifyOrderRate: '68.15%',
  couponSentCount: 336651,
  introducedGMV: '￥59446.5',
  couponVerifyRate: '1.09%',
  introducedGMVValue: 59446.5,
  introducedOrderAvgPrice: 16.27,
}

// 趋势图数据
export interface TrendData {
  date: string
  gmv: number
  avgPrice: number
}

export const mockTrendData: TrendData[] = [
  { date: '04-01', gmv: 5200, avgPrice: 15.8 },
  { date: '04-02', gmv: 7800, avgPrice: 16.1 },
  { date: '04-03', gmv: 9200, avgPrice: 16.5 },
  { date: '04-04', gmv: 8100, avgPrice: 15.9 },
  { date: '04-05', gmv: 10500, avgPrice: 16.8 },
  { date: '04-06', gmv: 12000, avgPrice: 17.2 },
  { date: '04-07', gmv: 6646.5, avgPrice: 14.9 },
]
