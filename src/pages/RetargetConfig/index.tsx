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
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ThunderboltOutlined,
  BranchesOutlined,
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
  mockNodes,
} from '../../mock/retargetConfig'

const { Text } = Typography

interface FlowNodeProps {
  label: string
  status: 'done' | 'process' | 'wait'
  icon: React.ReactNode
}

const FlowNode: React.FC<FlowNodeProps> = ({ label, status, icon }) => {
  const colorMap: Record<string, string> = {
    done: '#52c41a',
    process: '#1050DC',
    wait: '#d9d9d9',
  }

  return (
    <Card
      size="small"
      bordered
      style={{
        width: 160,
        textAlign: 'center',
        borderColor: colorMap[status],
      }}
    >
      <Space direction="vertical" size={4}>
        <span style={{ color: colorMap[status], fontSize: 20 }}>{icon}</span>
        <Text>{label}</Text>
        {status === 'done' && (
          <Tag icon={<CheckCircleOutlined />} color="success">
            已完成
          </Tag>
        )}
        {status === 'process' && (
          <Tag icon={<ClockCircleOutlined />} color="processing">
            进行中
          </Tag>
        )}
        {status === 'wait' && <Tag color="default">待配置</Tag>}
      </Space>
    </Card>
  )
}

interface RetargetPreviewCardProps {
  config: RetargetConfig
  onEdit: () => void
  onDelete: () => void
}

const RetargetPreviewCard: React.FC<RetargetPreviewCardProps> = ({
  config,
  onEdit,
  onDelete,
}) => {
  const scenarioLabel = config.scenario === 'unredeemed' ? '领券未核销' : '领券已核销'
  const actionTypes = (config.actionType || []) as string[]
  const actionLabels = actionTypes.map((t: string) => (t === 'reward' ? '奖励发放' : '消息触达'))

  const touchTimeLabel = useMemo(() => {
    if (!config.touchTimeType) return '-'
    switch (config.touchTimeType) {
      case 'fixed':
        return `固定时间: ${config.touchTimeFixed || '-'}`
      case 'dynamic':
        return `发券后 ${config.touchTimeValue || '-'} 小时`
      case 'immediate':
        return '核销后立即发放'
      case 'afterHours':
        return `核销后 ${config.touchTimeValue || '-'} 小时`
      default:
        return '-'
    }
  }, [config])

  return (
    <Card
      size="small"
      bordered
      style={{ width: 240 }}
      styles={{
        body: { padding: 12 },
      }}
      actions={[
        <Space key="actions">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={onEdit}>
            编辑
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={onDelete}>
            删除
          </Button>
        </Space>,
      ]}
    >
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <Space>
          <SendOutlined style={{ color: '#1050DC' }} />
          <Text strong>二次触达</Text>
        </Space>
        <Divider style={{ margin: '4px 0' }} />
        <Space direction="vertical" size={4}>
          <Space>
            <Text type="secondary">场景:</Text>
            <Tag color="blue">{scenarioLabel}</Tag>
          </Space>
          <Space>
            <Text type="secondary">触达时间:</Text>
            <Text>{touchTimeLabel}</Text>
          </Space>
          <Space>
            <Text type="secondary">触达内容:</Text>
            <Tag color="orange">{actionLabels.join(' + ')}</Tag>
          </Space>
          {config.couponIds && config.couponIds.length > 0 && (
            <Space>
              <Text type="secondary">优惠券:</Text>
              <Space wrap>
                {config.couponIds.map((id) => {
                  const coupon = mockCoupons.find((c) => c.value === id)
                  return (
                    <Tag key={id} color="geekblue">
                      {coupon?.label || id}
                    </Tag>
                  )
                })}
              </Space>
            </Space>
          )}
        </Space>
      </Space>
    </Card>
  )
}

// --- END RetargetPreviewCard ---

const RetargetCanvas: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [retargetConfig, setRetargetConfig] = useState<RetargetConfig | undefined>(undefined)

  const handleOpenDrawer = () => {
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
  }

  const handleConfirm = (config: RetargetConfig) => {
    setRetargetConfig(config)
    setDrawerOpen(false)
    message.success('二次触达配置已保存')
  }

  const handleDelete = () => {
    setRetargetConfig(undefined)
    message.info('已删除二次触达配置')
  }

  const handleSaveCanvas = () => {
    message.success('画布已保存')
  }

  const nodeIcons: Record<string, React.ReactNode> = {
    target: <UserOutlined />,
    event: <ThunderboltOutlined />,
    strategy: <BranchesOutlined />,
    action: <RocketOutlined />,
  }

  return (
    <div>
      {/* Top toolbar */}
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

      {/* Canvas area */}
      <div
        style={{
          minHeight: 400,
          background: '#f5f5f5',
          borderRadius: 8,
          padding: 40,
          display: 'flex',
          alignItems: 'center',
          overflowX: 'auto',
        }}
      >
        <Space size={16} align="center">
          {/* Flow nodes */}
          {mockNodes.map((node) => (
            <React.Fragment key={node.id}>
              <FlowNode
                label={node.label}
                status={node.status as 'done' | 'process' | 'wait'}
                icon={nodeIcons[node.icon] || null}
              />
              {node.id !== 'action' && <Text type="secondary">→</Text>}
              {node.id === 'action' && <Text type="secondary">→</Text>}
            </React.Fragment>
          ))}

          {/* Retarget button or preview */}
          {retargetConfig ? (
            <RetargetPreviewCard
              config={retargetConfig}
              onEdit={handleOpenDrawer}
              onDelete={handleDelete}
            />
          ) : (
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleOpenDrawer}
              style={{ width: 160, height: 100 }}
            >
              + 二次触达
            </Button>
          )}
        </Space>
      </div>

      {/* Retarget configuration drawer */}
      <RetargetDrawer
        open={drawerOpen}
        canvasName={mockCanvasName}
        couponOptions={mockCoupons}
        initialValues={retargetConfig}
        onClose={handleCloseDrawer}
        onConfirm={handleConfirm}
      />
    </div>
  )
}

export default RetargetCanvas
