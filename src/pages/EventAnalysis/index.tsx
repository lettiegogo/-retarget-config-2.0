import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Typography,
  Space,
  Divider,
  Radio,
  Tag,
  Button,
  Descriptions,
  Select,
} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import {
  mockCampaignInfo,
  mockCoreMetrics,
} from '../../mock/eventAnalysis'

const { Title, Text, Link } = Typography

const EventAnalysis: React.FC = () => {
  const navigate = useNavigate()
  const [reportTab, setReportTab] = useState('new')
  const [timeRange, setTimeRange] = useState('7d')
  const [touchStage, setTouchStage] = useState<string | undefined>(undefined)
  const [retargetNameFilter, setRetargetNameFilter] = useState<string | undefined>(undefined)

  const {
    name, type, targetBehavior, canvasType, canvasId,
    taskStartDate, taskEndDate, campaignPurpose, hasRetarget, retargetNames,
  } = mockCampaignInfo

  const {
    canvasCoverageUsers, newUserCount, verifyOrderRate,
    couponSentCount, introducedGMV, couponVerifyRate,
    introducedOrderAvgPrice,
  } = mockCoreMetrics

  return (
    <div>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Title level={4} style={{ margin: 0 }}>
          营销事件分析看板
        </Title>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/retarget-canvas')}>
          返回
        </Button>
      </Space>

      {/* 基础信息 */}
      <Space style={{ marginBottom: 8 }}>
        <Text strong style={{ fontSize: 14 }}>基础信息</Text>
        <Link>点击查看画布策略&gt;</Link>
        <Link>奖品发放详情&amp;参与记录&gt;</Link>
        <Link>查看火山AB实验结果</Link>
      </Space>

      <Descriptions column={4} size="small" style={{ marginBottom: 24 }}>
        <Descriptions.Item label="营销事件名称">{name}</Descriptions.Item>
        <Descriptions.Item label="画布ID">{canvasId}</Descriptions.Item>
        <Descriptions.Item label="营销流程类型">{type}</Descriptions.Item>
        <Descriptions.Item label="任务开始日期时间">{taskStartDate}</Descriptions.Item>
        <Descriptions.Item label="目标行为">{targetBehavior}</Descriptions.Item>
        <Descriptions.Item label="任务结束日期时间">{taskEndDate}</Descriptions.Item>
        <Descriptions.Item label="画布类型">{canvasType}</Descriptions.Item>
        <Descriptions.Item label="本次营销目的">{campaignPurpose}</Descriptions.Item>
        <Descriptions.Item label="是否配置二次触达">
          <Tag color={hasRetarget ? 'green' : 'default'}>{hasRetarget ? '是' : '否'}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="二次触达名称">
          {hasRetarget ? retargetNames.join('，') : '-'}
        </Descriptions.Item>
      </Descriptions>

      <Divider style={{ margin: '12px 0 16px' }} />

      {/* 数据报告 TAB */}
      <Space style={{ marginBottom: 16 }}>
        <Radio.Group
          value={reportTab}
          onChange={(e) => setReportTab(e.target.value)}
          buttonStyle="solid"
          size="small"
        >
          <Radio.Button value="new">数据报告（新版）</Radio.Button>
          <Radio.Button value="old">数据报告（旧版）</Radio.Button>
        </Radio.Group>
      </Space>

      {/* 筛选栏 */}
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Space>
          <Text strong>指标计算范围</Text>
          <Radio.Group
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            buttonStyle="solid"
            size="small"
          >
            <Radio.Button value="7d">活动开始7天</Radio.Button>
            <Radio.Button value="14d">活动开始14天</Radio.Button>
            <Radio.Button value="30d">活动开始30天</Radio.Button>
          </Radio.Group>
          <Divider type="vertical" style={{ height: 20 }} />
          <Text strong>触达阶段</Text>
          <Radio.Group
            value={touchStage}
            onChange={(e) => {
              setTouchStage(e.target.value)
              setRetargetNameFilter(undefined)
            }}
            buttonStyle="solid"
            size="small"
          >
            <Radio.Button value="first">首次触达</Radio.Button>
            <Radio.Button value="second">二次触达</Radio.Button>
          </Radio.Group>
          {touchStage === 'second' && (
            <>
              <Divider type="vertical" style={{ height: 20 }} />
              <Text strong>二次触达名称</Text>
              <Select
                style={{ width: 160 }}
                placeholder="全部"
                allowClear
                value={retargetNameFilter}
                onChange={setRetargetNameFilter}
                options={retargetNames.map((n) => ({ label: n, value: n }))}
              />
            </>
          )}
        </Space>
        <Text type="secondary">
          数据更新时间：2026-04-21 17:35:59
        </Text>
      </Space>

      {/* 核心指标 */}
      <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 12 }}>
        核心指标
      </Text>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="画布覆盖人数" value={canvasCoverageUsers.toLocaleString()} />
        <MetricCard label="引入下单用户数" value={newUserCount.toLocaleString()} />
        <MetricCard label="核销订单到手率" value={verifyOrderRate} />
        <MetricCard label="优惠券发放数量" value={couponSentCount.toLocaleString()} />
        <MetricCard label="引入GMV（流水）" value={introducedGMV} />
        <MetricCard label="优惠券核销率" value={couponVerifyRate} />
      </div>

      {/* 转化指标/趋势图 */}
      <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 12 }}>
        转化指标/趋势图
      </Text>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 24 }}>
        <MetricCard label="引入GMV（流水）" value={introducedGMV} />
        <MetricCard label="引入订单单均价（AC）" value={`￥${introducedOrderAvgPrice}`} />
      </div>

      {/* 趋势图占位 */}
      <div style={{
        border: '1px solid #f0f0f0',
        borderRadius: 8,
        padding: 24,
        minHeight: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafafa',
      }}>
        <Text type="secondary">引入GMV（流水）趋势图 — 单位：元</Text>
      </div>
    </div>
  )
}

const MetricCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{
    border: '1px solid #f0f0f0',
    borderRadius: 8,
    padding: '16px 20px',
    background: '#fff',
  }}>
    <Text type="secondary" style={{ fontSize: 13 }}>{label}</Text>
    <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>{value}</div>
  </div>
)

export default EventAnalysis
