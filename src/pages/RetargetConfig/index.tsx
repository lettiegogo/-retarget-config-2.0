import React, { useState, useMemo } from 'react'
import {
  Card,
  Button,
  Space,
  Tag,
  Typography,
  message,
  Divider,
} from 'antd'
import {
  PlusOutlined,
  UserOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  SendOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons'
import RetargetDrawer from './RetargetDrawer'
import type { RetargetConfig } from '../../mock/retargetConfig'
import {
  mockCanvasName,
  mockCoupons,
} from '../../mock/retargetConfig'

const { Text } = Typography

/* ============================================================
   流程节点
   ============================================================ */

interface FlowNodeProps {
  label: string
  color: string
  icon: React.ReactNode
}

const FlowNode: React.FC<FlowNodeProps> = ({ label, color, icon }) => (
  <Card
    bordered
    style={{ width: 180, padding: 0, overflow: 'hidden', borderColor: '#e8e8e8' }}
    styles={{ body: { padding: 0 } }}
  >
    <div style={{ padding: '10px 16px', background: `${color}12` }}>
      <Space>
        {icon}
        <Text style={{ color }}>{label}</Text>
      </Space>
    </div>
    <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'center' }}>
      <Button size="small" type="dashed" icon={<PlusOutlined />}>
        点击添加
      </Button>
    </div>
  </Card>
)

/* 连接线上的圆形 + 按钮 */

const ConnectorPlus: React.FC<{ color?: string; label?: string; onClick?: () => void }> = ({
  color = '#1050DC',
  label,
  onClick,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Button
      type="primary"
      shape="circle"
      size="small"
      icon={<PlusOutlined style={{ fontSize: 12 }} />}
      style={{ background: color, borderColor: color }}
      onClick={onClick}
    />
    {label && <Text type="secondary" style={{ fontSize: 12, marginTop: 4 }}>{label}</Text>}
  </div>
)

/* 水平短线 */

const ConnectorLine: React.FC = () => (
  <div style={{ width: 32, height: 2, background: '#d9d9d9', flexShrink: 0 }} />
)

/* ============================================================
   二次触达预览卡片
   ============================================================ */

interface RetargetPreviewCardProps {
  config: RetargetConfig
  onEdit: () => void
  onDelete: () => void
}

const RetargetPreviewCard: React.FC<RetargetPreviewCardProps> = ({ config, onEdit, onDelete }) => {
  const scenarioLabel = config.scenario === 'unredeemed' ? '领券未核销' : '领券已核销'
  const actionTypes = (config.actionType || []) as string[]

  const touchTimeLabel = useMemo(() => {
    if (!config.touchTimeType) return '-'
    switch (config.touchTimeType) {
      case 'fixed':
        return config.touchTimeFixed || '-'
      case 'dynamic':
        return `优惠券发放后 ${config.touchTimeValue || '-'} 小时`
      case 'immediate':
        return '券核销后立即发放'
      case 'afterHours':
        return `券核销后 ${config.touchTimeValue || '-'} 小时发放`
      default:
        return '-'
    }
  }, [config])

  const actionConfig = (config.actionConfig || {}) as Record<string, unknown>
  const prizes = (actionConfig.prizes || []) as { prizeType?: string; prizeContent?: string; prizeCount?: number }[]
  const messageTemplate = actionConfig.messageTemplate as string | undefined

  const couponLabels = useMemo(() => {
    if (!config.couponIds) return []
    return config.couponIds.map((id) => {
      const c = mockCoupons.find((x) => x.value === id)
      return c?.label || id
    })
  }, [config.couponIds])

  const hasReward = actionTypes.includes('reward')
  const hasMessage = actionTypes.includes('message')

  const prizeTypeLabel = (t?: string) => {
    const map: Record<string, string> = { coupon: '优惠券', points: '积分', physical: '实物礼品' }
    return t ? map[t] || t : '-'
  }
  const prizeContentLabel = (v?: string) => {
    const map: Record<string, string> = {
      tpl_001: '满100减20优惠券',
      tpl_002: '满200减50优惠券',
      tpl_003: '新人专享8折券',
    }
    return v ? map[v] || v : '-'
  }

  return (
    <Card
      bordered
      style={{ width: 340, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer' }}
      styles={{ body: { padding: 0 } }}
      onClick={onEdit}
    >
      {/* 卡片头部 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '1px solid #f0f0f0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Space>
          <SendOutlined style={{ color: '#1050DC', fontSize: 16 }} />
          <Text strong style={{ color: '#1050DC' }}>二次触达</Text>
        </Space>
        <Space size={4}>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); onEdit() }} />
          <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={(e) => { e.stopPropagation(); onDelete() }} />
        </Space>
      </div>

      <div style={{ padding: '8px 16px 16px' }}>
        {/* 人群配置 */}
        <Text strong style={{ fontSize: 14 }}>人群配置</Text>
        <Divider style={{ margin: '8px 0' }} />
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Text type="secondary">触达场景</Text>
            <Tag color="orange" style={{ margin: 0 }}>{scenarioLabel}</Tag>
          </Space>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Text type="secondary">关联优惠券</Text>
            <Text>{couponLabels.join('、') || '-'}</Text>
          </Space>
        </Space>

        {/* 执行动作 */}
        <Divider style={{ margin: '12px 0 8px' }} />
        <Text strong style={{ fontSize: 14 }}>执行动作</Text>
        <Divider style={{ margin: '8px 0' }} />
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Text type="secondary">触达时间</Text>
            <Text>{touchTimeLabel}</Text>
          </Space>

          {hasReward && (
            <>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Text type="secondary">奖励发放</Text>
                <Text>{prizes.length > 0 ? '已配置' : '-'}</Text>
              </Space>
              {prizes.length > 0 &&
                prizes.map((p, i) => (
                  <div key={i} style={{ background: '#fafafa', borderRadius: 4, padding: '8px 12px' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>奖品{i + 1}</Text>
                    <Space direction="vertical" size={2} style={{ marginTop: 4, marginLeft: 16 }}>
                      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>类型</Text>
                        <Text style={{ fontSize: 12 }}>{prizeTypeLabel(p.prizeType)}</Text>
                      </Space>
                      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>内容</Text>
                        <Text style={{ fontSize: 12 }}>{prizeContentLabel(p.prizeContent)}</Text>
                      </Space>
                      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>数量</Text>
                        <Text style={{ fontSize: 12 }}>{p.prizeCount ?? '-'}</Text>
                      </Space>
                    </Space>
                  </div>
                ))}
            </>
          )}

          {hasMessage && (
            <>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Text type="secondary">消息触达</Text>
                <Text>已配置</Text>
              </Space>
              {messageTemplate && (
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Text type="secondary">消息模板</Text>
                  <Text style={{ fontSize: 12 }}>{messageTemplate}</Text>
                </Space>
              )}
            </>
          )}

          {!hasReward && !hasMessage && (
            <Text type="secondary">-</Text>
          )}
        </Space>
      </div>
    </Card>
  )
}

/* ============================================================
   画布主组件
   ============================================================ */

const RetargetCanvas: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [retargetConfigList, setRetargetConfigList] = useState<RetargetConfig[]>([])
  const [editIndex, setEditIndex] = useState<number | undefined>(undefined)

  const handleOpenDrawer = () => {
    setEditIndex(undefined)
    setDrawerOpen(true)
  }

  const handleEditDrawer = (index: number) => {
    setEditIndex(index)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setEditIndex(undefined)
  }

  const handleConfirm = (config: RetargetConfig) => {
    if (editIndex !== undefined) {
      setRetargetConfigList((prev) => prev.map((item, i) => (i === editIndex ? config : item)))
      message.success('二次触达配置已更新')
    } else {
      setRetargetConfigList((prev) => [...prev, config])
      message.success('二次触达配置已保存')
    }
    setEditIndex(undefined)
  }

  const handleDelete = (index: number) => {
    setRetargetConfigList((prev) => prev.filter((_, i) => i !== index))
    message.info('已删除二次触达配置')
  }

  const handleSaveCanvas = () => {
    message.success('画布已保存')
  }

  return (
    <div>
      {/* 顶部工具栏 */}
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Space>
          <Button type="link">返回</Button>
          <Text strong>{mockCanvasName}</Text>
        </Space>
        <Space>
          <Button>草稿</Button>
          <Button type="primary" onClick={handleSaveCanvas}>
            保存画布
          </Button>
        </Space>
      </Space>

      {/* 画布区域 */}
      <div
        style={{
          minHeight: 360,
          background: '#f5f5f5',
          backgroundImage: 'radial-gradient(circle, #d9d9d9 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          borderRadius: 8,
          padding: '40px 24px',
          overflowX: 'auto',
        }}
      >
        {/* 一行布局：主流程 + 右侧卡片列 */}
        <Space size={16} align="start">
          {/* 主流程行 */}
          <Space size={0} align="center">
            <FlowNode label="目标人群" color="#1050DC" icon={<UserOutlined style={{ color: '#1050DC' }} />} />
            <ConnectorLine />
            <FlowNode label="进入事件" color="#52c41a" icon={<ThunderboltOutlined style={{ color: '#52c41a' }} />} />
            <ConnectorLine />
            <ConnectorPlus label="分流策略" />
            <ConnectorLine />
            <FlowNode label="执行动作" color="#fa8c16" icon={<RocketOutlined style={{ color: '#fa8c16' }} />} />
            <ConnectorLine />
            <ConnectorPlus color="#722ed1" label="二次触达" onClick={handleOpenDrawer} />
          </Space>

          {/* 右侧：卡片列垂直堆叠 */}
          {retargetConfigList.length > 0 && (
            <Space direction="vertical" size={12}>
              {retargetConfigList.map((config, index) => (
                <RetargetPreviewCard
                  key={index}
                  config={config}
                  onEdit={() => handleEditDrawer(index)}
                  onDelete={() => handleDelete(index)}
                />
              ))}
            </Space>
          )}
        </Space>
      </div>

      {/* 配置抽屉 */}
      <RetargetDrawer
        open={drawerOpen}
        canvasName={mockCanvasName}
        couponOptions={mockCoupons}
        initialValues={editIndex !== undefined ? retargetConfigList[editIndex] : undefined}
        onClose={handleCloseDrawer}
        onConfirm={handleConfirm}
      />
    </div>
  )
}

export default RetargetCanvas
