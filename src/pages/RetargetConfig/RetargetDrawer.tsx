import React, { useState, useEffect } from 'react'
import {
  Drawer,
  Steps,
  Form,
  Radio,
  Select,
  Input,
  InputNumber,
  Button,
  Space,
  Card,
  Typography,
  DatePicker,
  message,
} from 'antd'
import type { RetargetConfig } from '../../mock/retargetConfig'
import { PlusOutlined, DeleteOutlined, CheckCircleFilled } from '@ant-design/icons'

const { Text } = Typography

const SectionTitle: React.FC<{ title: string; style?: React.CSSProperties }> = ({ title, style: s }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, ...s }}>
    <div style={{ width: 3, height: 16, background: '#1050DC', marginRight: 8 }} />
    <Text strong>{title}</Text>
  </div>
)

interface RetargetDrawerProps {
  open: boolean
  canvasName: string
  couponOptions: { label: string; value: string }[]
  initialValues?: RetargetConfig
  onClose: () => void
  onConfirm: (config: RetargetConfig) => void
}

const RetargetDrawer: React.FC<RetargetDrawerProps> = ({
  open,
  canvasName,
  couponOptions,
  initialValues,
  onClose,
  onConfirm,
}) => {
  const [current, setCurrent] = useState(0)
  const [form] = Form.useForm()

  const scenario = Form.useWatch('scenario', form)
  const touchTimeType = Form.useWatch('touchTimeType', form)
  const actionType = Form.useWatch('actionType', form) || []

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue(initialValues)
      } else {
        form.resetFields()
      }
      setCurrent(0)
    }
  }, [open])

  const handleNext = async () => {
    try {
      if (current === 0) {
        await form.validateFields(['name', 'scenario', 'couponIds'])
      } else {
        await form.validateFields(['touchTimeType', 'actionType'])
      }
      setCurrent(current + 1)
    } catch {
      // validation failed
    }
  }

  const handlePrev = () => {
    setCurrent(current - 1)
  }

  const handleConfirm = async () => {
    try {
      if (current === 0) {
        await form.validateFields(['name', 'scenario', 'couponIds'])
        message.warning('请先完成第二步配置')
        setCurrent(1)
        return
      }
      // current === 1: validate all and submit
      const values = await form.validateFields()
      onConfirm(values)
      onClose()
    } catch {
      message.error('请填写完整的配置信息')
    }
  }

  const handleClose = () => {
    onClose()
  }

  const stepItems = [
    { title: '二次触达人群' },
    { title: '二次触达执行动作' },
  ]

  return (
    <Drawer
      title="二次触达配置"
      open={open}
      onClose={handleClose}
      width={520}
      extra={
        <Space>
          <Button onClick={handleClose}>取消</Button>
          <Button type="primary" onClick={handleConfirm}>
            确定
          </Button>
        </Space>
      }
      footer={
        current > 0 ? (
          <Space style={{ float: 'right' }}>
            <Button onClick={handlePrev}>上一步</Button>
            {current < stepItems.length - 1 && (
              <Button type="primary" onClick={handleNext}>
                下一步
              </Button>
            )}
          </Space>
        ) : (
          <Space style={{ float: 'right' }}>
            <Button type="primary" onClick={handleNext}>
              下一步
            </Button>
          </Space>
        )
      }
    >
      <Steps
        current={current}
        items={stepItems}
        style={{ marginBottom: 24 }}
      />

      <Form form={form} layout="vertical" initialValues={initialValues}>
        {/* Step 1: 人群配置 */}
        <div style={{ display: current === 0 ? 'block' : 'none' }}>
          <Form.Item
            label="关联画布"
            name="relatedCanvas"
            initialValue={canvasName}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="二次触达名称"
            name="name"
            rules={[{ required: true, message: '请输入二次触达名称' }]}
          >
            <Input placeholder="请输入二次触达名称" maxLength={20} />
          </Form.Item>

          <Form.Item
            label="二次触达场景"
            name="scenario"
            rules={[{ required: true, message: '请选择二次触达场景' }]}
          >
            <Radio.Group value={scenario} onChange={(e) => form.setFieldValue('scenario', e.target.value)}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Card
                  size="small"
                  style={{
                    cursor: 'pointer',
                    borderColor: scenario === 'unredeemed' ? '#1050DC' : '#d9d9d9',
                  }}
                >
                  <Radio value="unredeemed">
                    领券未核销（触达人群为画布上一轮发券后，领券但未核销的用户）
                  </Radio>
                </Card>
                <Card
                  size="small"
                  style={{
                    cursor: 'pointer',
                    borderColor: scenario === 'redeemed' ? '#1050DC' : '#d9d9d9',
                  }}
                >
                  <Radio value="redeemed">
                    领券已核销（触达人群为画布上一轮发券后，领券且已核销的用户）
                  </Radio>
                </Card>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="已发放的优惠券"
            name="couponIds"
            rules={[{ required: true, message: '请选择优惠券' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择优惠券"
              options={couponOptions}
              maxTagCount="responsive"
            />
          </Form.Item>
        </div>

        {/* Step 2: 执行动作配置 */}
        <div style={{ display: current === 1 ? 'block' : 'none' }}>
          <SectionTitle title="触达时间" />

          <Form.Item
            label="二次触达时间"
            name="touchTimeType"
            rules={[{ required: true, message: '请选择触达时间类型' }]}
          >
            <Radio.Group>
              <Space direction="vertical" style={{ width: '100%' }}>
                {scenario === 'unredeemed' && (
                  <>
                    <Radio value="fixed">
                      <Space>
                        <span>固定时间</span>
                        {touchTimeType === 'fixed' && (
                          <Form.Item name="touchTimeFixed" noStyle>
                            <DatePicker
                              showTime
                              size="small"
                              style={{ width: 240 }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </Form.Item>
                        )}
                      </Space>
                    </Radio>
                    <Radio value="dynamic">
                      <Space>
                        <span>优惠券发放后</span>
                        {touchTimeType === 'dynamic' && (
                          <Form.Item name="touchTimeValue" noStyle>
                            <InputNumber
                              size="small"
                              min={1}
                              max={720}
                              style={{ width: 100 }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </Form.Item>
                        )}
                        {touchTimeType !== 'dynamic' && <span style={{ color: '#bfbfbf' }}>x</span>}
                        <span>小时</span>
                      </Space>
                    </Radio>
                  </>
                )}
                {scenario === 'redeemed' && (
                  <>
                    <Radio value="immediate">券核销后立即发放</Radio>
                    <Radio value="afterHours">
                      <Space>
                        <span>券核销后</span>
                        {touchTimeType === 'afterHours' && (
                          <Form.Item name="touchTimeValue" noStyle>
                            <InputNumber
                              size="small"
                              min={1}
                              max={720}
                              style={{ width: 100 }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </Form.Item>
                        )}
                        {touchTimeType !== 'afterHours' && <span style={{ color: '#bfbfbf' }}>x</span>}
                        <span>小时发放</span>
                      </Space>
                    </Radio>
                  </>
                )}
              </Space>
            </Radio.Group>
          </Form.Item>

          <SectionTitle title="触达内容" style={{ marginTop: 24 }} />

          {/* 执行动作选择 */}
          <Form.Item
            label="执行动作"
            name="actionType"
            initialValue={[]}
            rules={[{ required: true, message: '请至少选择一个执行动作', type: 'array', min: 1 }]}
          >
            <Space size={12} wrap>
              <Card
                size="small"
                style={{
                  width: 220,
                  cursor: 'pointer',
                  borderColor: actionType.includes('reward') ? '#1050DC' : '#d9d9d9',
                }}
                onClick={() => {
                  const val = form.getFieldValue('actionType') || []
                  if (val.includes('reward')) {
                    form.setFieldValue('actionType', val.filter((v: string) => v !== 'reward'))
                  } else {
                    form.setFieldValue('actionType', [...val, 'reward'])
                  }
                }}
              >
                <Space direction="vertical" size={2}>
                  <Space>
                    <Text strong>奖励发放</Text>
                    {actionType.includes('reward') && (
                      <CheckCircleFilled style={{ color: '#1050DC', fontSize: 14 }} />
                    )}
                  </Space>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    对目标客户发放优惠券、积分、实物礼品等奖励
                  </Text>
                </Space>
              </Card>
              <Card
                size="small"
                style={{
                  width: 220,
                  cursor: 'pointer',
                  borderColor: actionType.includes('message') ? '#1050DC' : '#d9d9d9',
                }}
                onClick={() => {
                  const val = form.getFieldValue('actionType') || []
                  if (val.includes('message')) {
                    form.setFieldValue('actionType', val.filter((v: string) => v !== 'message'))
                  } else {
                    form.setFieldValue('actionType', [...val, 'message'])
                  }
                }}
              >
                <Space direction="vertical" size={2}>
                  <Space>
                    <Text strong>消息触达</Text>
                    {actionType.includes('message') && (
                      <CheckCircleFilled style={{ color: '#1050DC', fontSize: 14 }} />
                    )}
                  </Space>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    对目标客户发送短信、小程序订阅消息
                  </Text>
                </Space>
              </Card>
            </Space>
          </Form.Item>

          {/* 奖励发放配置 */}
          {actionType.includes('reward') && (
            <>
              <Form.Item
                label="领取方式"
                name={['actionConfig', 'receiveMethod']}
                initialValue="auto"
              >
                <Radio.Group>
                  <Radio value="auto">自动</Radio>
                  <Radio value="manual">手动</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item label="奖励配置">
                <Form.List name={['actionConfig', 'prizes']}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Card
                          key={key}
                          size="small"
                          style={{ marginBottom: 12, background: '#fafafa' }}
                          title={`奖品${name + 1}`}
                          extra={
                            <Button
                              type="link"
                              size="small"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => remove(name)}
                            >
                              移除
                            </Button>
                          }
                        >
                          <Form.Item
                            {...restField}
                            name={[name, 'prizeType']}
                            label="奖品类型"
                            rules={[{ required: true, message: '请选择奖品类型' }]}
                          >
                            <Select
                              placeholder="请选择奖品类型"
                              options={[
                                { label: '优惠券', value: 'coupon' },
                                { label: '积分', value: 'points' },
                                { label: '实物礼品', value: 'physical' },
                              ]}
                            />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'prizeContent']}
                            label="奖品内容"
                            rules={[{ required: true, message: '请选择奖品内容' }]}
                          >
                            <Select
                              placeholder="请选择奖品内容"
                              options={[
                                { label: '满100减20优惠券', value: 'tpl_001' },
                                { label: '满200减50优惠券', value: 'tpl_002' },
                                { label: '新人专享8折券', value: 'tpl_003' },
                              ]}
                            />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'prizeCount']}
                            label="奖品数量"
                          >
                            <InputNumber
                              min={1}
                              style={{ width: '100%' }}
                              placeholder="请输入奖品数量"
                            />
                          </Form.Item>
                        </Card>
                      ))}
                      <Button
                        type="dashed"
                        onClick={() => add({ prizeType: 'coupon', prizeContent: 'tpl_001', prizeCount: 1 })}
                        block
                        icon={<PlusOutlined />}
                      >
                        增加奖品
                      </Button>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            </>
          )}

          {/* 消息触达配置 */}
          {actionType.includes('message') && (
            <>
              <Form.Item
                label="发送方式"
                name={['actionConfig', 'sendMethod']}
                initialValue="auto"
              >
                <Radio.Group>
                  <Radio value="auto">自动消息</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label="消息模板"
                name={['actionConfig', 'messageTemplate']}
                rules={[{ required: true, message: '请选择消息模板' }]}
              >
                <Select
                  placeholder="请选择消息模板"
                  options={[
                    { label: '优惠券到期提醒模板', value: 'tpl_001' },
                    { label: '核销成功通知模板', value: 'tpl_002' },
                    { label: '活动召回模板', value: 'tpl_003' },
                  ]}
                />
              </Form.Item>
              <Form.Item label=" ">
                <Button type="link">+ 新建消息模版</Button>
              </Form.Item>
            </>
          )}
        </div>
      </Form>
    </Drawer>
  )
}

export default RetargetDrawer
