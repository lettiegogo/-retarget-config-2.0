import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  Form,
  Input,
  Select,
  Button,
  Space,
  Row,
  Col,
  DatePicker,
  Typography,
  Divider,
  Tag,
} from 'antd'
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  mockRewardStats,
  mockParticipationRecords,
  splitOptions,
  retargetNameOptions,
  type RewardStat,
  type ParticipationRecord,
} from '../../mock/statistics'

const { Title } = Typography
const { RangePicker } = DatePicker

const stageMap: Record<string, string> = {
  first: '首次触达',
  second: '二次触达',
}

const scenarioMap: Record<string, string> = {
  unredeemed: '领券未核销',
  redeemed: '领券已核销',
}

const redeemStatusMap: Record<string, string> = {
  unredeemed: '未核销',
  redeemed: '已核销',
}

const stageColorMap: Record<string, string> = {
  first: 'blue',
  second: 'orange',
}

const Statistics: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  // 筛选状态
  const [rewardStageFilter, setRewardStageFilter] = useState<string | undefined>(undefined)
  const [rewardSplitFilter, setRewardSplitFilter] = useState<string | undefined>(undefined)
  const [rewardRetargetNameFilter, setRewardRetargetNameFilter] = useState<string | undefined>(undefined)
  const [recordStageFilter, setRecordStageFilter] = useState<string | undefined>(undefined)
  const [recordSearch, setRecordSearch] = useState({
    userId: '',
    nickname: '',
    phone: '',
    giftSendStatus: undefined as string | undefined,
    messageSendStatus: undefined as string | undefined,
    splitName: '',
    retargetName: '',
    isControl: undefined as string | undefined,
    dateRange: undefined as [string, string] | undefined,
  })

  // 任务奖励统计数据（按触达阶段筛选）
  const filteredRewardStats = useMemo(() => {
    let data = [...mockRewardStats]
    if (rewardStageFilter) {
      data = data.filter((item) => item.stage === rewardStageFilter)
    }
    if (rewardStageFilter === 'first' && rewardSplitFilter) {
      data = data.filter((item) => item.splitName === rewardSplitFilter)
    }
    if (rewardStageFilter === 'second' && rewardRetargetNameFilter) {
      data = data.filter((item) => item.retargetName === rewardRetargetNameFilter)
    }
    return data
  }, [rewardStageFilter, rewardSplitFilter, rewardRetargetNameFilter])

  // 参与记录数据（按触达阶段等筛选）
  const filteredRecords = useMemo(() => {
    let data = [...mockParticipationRecords]
    if (recordStageFilter) {
      data = data.filter((item) => item.stage === recordStageFilter)
    }
    if (recordSearch.userId) {
      data = data.filter((item) => item.userId.includes(recordSearch.userId))
    }
    if (recordSearch.nickname) {
      data = data.filter((item) => item.nickname.includes(recordSearch.nickname))
    }
    if (recordSearch.phone) {
      data = data.filter((item) => item.phone.includes(recordSearch.phone))
    }
    if (recordSearch.giftSendStatus) {
      data = data.filter((item) => item.giftSendStatus === recordSearch.giftSendStatus)
    }
    if (recordSearch.messageSendStatus) {
      data = data.filter((item) => item.messageSendStatus === recordSearch.messageSendStatus)
    }
    if (recordStageFilter === 'first' && recordSearch.splitName) {
      data = data.filter((item) => item.splitName.includes(recordSearch.splitName))
    }
    if (recordStageFilter === 'second' && recordSearch.retargetName) {
      data = data.filter((item) => item.retargetName === recordSearch.retargetName)
    }
    if (recordSearch.isControl) {
      data = data.filter((item) => item.isControl === recordSearch.isControl)
    }
    return data
  }, [recordStageFilter, recordSearch])

  // 是否在二次触达筛选状态下
  const isSecondStage = recordStageFilter === 'second'

  // 任务奖励统计列
  const rewardColumns: ColumnsType<RewardStat> = [
    { title: '序号', dataIndex: 'id', key: 'id', width: 60 },
    { title: '券码ID', dataIndex: 'couponCode', key: 'couponCode' },
    { title: '优惠券名称', dataIndex: 'couponName', key: 'couponName' },
    { title: '占用数量', dataIndex: 'allocatedCount', key: 'allocatedCount' },
    { title: '发出数量', dataIndex: 'sentCount', key: 'sentCount' },
    { title: '剩余数量', dataIndex: 'remainingCount', key: 'remainingCount' },
    { title: '发出占比', dataIndex: 'sentRatio', key: 'sentRatio' },
    {
      title: '触达阶段',
      dataIndex: 'stage',
      key: 'stage',
      render: (val: string) => <Tag color={stageColorMap[val]}>{stageMap[val]}</Tag>,
    },
  ]

  // 参与记录列（根据触达阶段动态显示）
  const recordColumns: ColumnsType<ParticipationRecord> = useMemo(() => {
    const baseCols: ColumnsType<ParticipationRecord> = [
      { title: '序号', dataIndex: 'id', key: 'id', width: 60 },
      { title: '用户编码', dataIndex: 'userId', key: 'userId', ellipsis: true },
      { title: '昵称/姓名', dataIndex: 'nickname', key: 'nickname' },
      { title: '手机号', dataIndex: 'phone', key: 'phone' },
      { title: '分流名称', dataIndex: 'splitName', key: 'splitName' },
      { title: '是否为对照组', dataIndex: 'isControl', key: 'isControl' },
      { title: '行为完成时间', dataIndex: 'behaviorCompleteTime', key: 'behaviorCompleteTime' },
      { title: '任务完成时间', dataIndex: 'taskCompleteTime', key: 'taskCompleteTime' },
      { title: '礼品发送状态', dataIndex: 'giftSendStatus', key: 'giftSendStatus' },
      { title: '礼品发送时间', dataIndex: 'giftSendTime', key: 'giftSendTime' },
      { title: '消息发送状态', dataIndex: 'messageSendStatus', key: 'messageSendStatus' },
      { title: '消息发送时间', dataIndex: 'messageSendTime', key: 'messageSendTime' },
    ]

    // 触达阶段=二次触达时，插入额外字段
    if (isSecondStage) {
      baseCols.splice(6, 0,
        { title: '触达阶段', dataIndex: 'stage', key: 'stage', render: (val: string) => <Tag color={stageColorMap[val]}>{stageMap[val]}</Tag> },
        { title: '二次触达场景', dataIndex: 'scenario', key: 'scenario', render: (val: string) => <Tag>{scenarioMap[val] || val}</Tag> },
        { title: '二次触达名称', dataIndex: 'retargetName', key: 'retargetName' },
      )
      baseCols.push(
        { title: '核销状态', dataIndex: 'redeemStatus', key: 'redeemStatus', render: (val: string) => (
          <Tag color={val === 'redeemed' ? 'green' : 'red'}>{redeemStatusMap[val] || val}</Tag>
        )},
        { title: '二次触达时间', dataIndex: 'secondTouchTime', key: 'secondTouchTime' },
        { title: '二次触达结果', dataIndex: 'secondTouchResult', key: 'secondTouchResult' },
      )
    } else {
      // 首次触达时，也显示触达阶段列
      baseCols.splice(6, 0,
        { title: '触达阶段', dataIndex: 'stage', key: 'stage', render: (val: string) => <Tag color={stageColorMap[val]}>{stageMap[val]}</Tag> },
      )
    }

    return baseCols
  }, [isSecondStage])

  const handleSearch = (values: Record<string, unknown>) => {
    setRecordSearch({
      userId: (values.userId as string) || '',
      nickname: (values.nickname as string) || '',
      phone: (values.phone as string) || '',
      giftSendStatus: values.giftSendStatus as string | undefined,
      messageSendStatus: values.messageSendStatus as string | undefined,
      splitName: (values.splitName as string) || '',
      retargetName: (values.retargetName as string) || '',
      isControl: values.isControl as string | undefined,
      dateRange: values.dateRange as [string, string] | undefined,
    })
  }

  const handleReset = () => {
    form.resetFields()
    setRecordSearch({
      userId: '',
      nickname: '',
      phone: '',
      giftSendStatus: undefined,
      messageSendStatus: undefined,
      splitName: '',
      retargetName: '',
      isControl: undefined,
      dateRange: undefined,
    })
    setRecordStageFilter(undefined)
    setRewardSplitFilter(undefined)
    setRewardRetargetNameFilter(undefined)
  }

  return (
    <div>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Title level={4} style={{ margin: 0 }}>
          营销事件统计
        </Title>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/retarget-canvas')}>
          返回
        </Button>
      </Space>

      {/* 任务奖励统计 */}
      <Title level={5}>任务奖励统计</Title>
      <Space style={{ marginBottom: 16 }}>
        <span>触达阶段：</span>
        <Select
          style={{ width: 120 }}
          placeholder="全部"
          allowClear
          value={rewardStageFilter}
          onChange={(val) => {
            setRewardStageFilter(val)
            setRewardSplitFilter(undefined)
            setRewardRetargetNameFilter(undefined)
          }}
          options={[
            { label: '首次触达', value: 'first' },
            { label: '二次触达', value: 'second' },
          ]}
        />
        {rewardStageFilter === 'first' && (
          <>
            <span>分流筛选：</span>
            <Select
              style={{ width: 180 }}
              placeholder="请选择"
              allowClear
              value={rewardSplitFilter}
              onChange={setRewardSplitFilter}
              options={splitOptions.map((name) => ({ label: name, value: name }))}
            />
          </>
        )}
        {rewardStageFilter === 'second' && (
          <>
            <span>二次触达名称：</span>
            <Select
              style={{ width: 180 }}
              placeholder="请选择"
              allowClear
              value={rewardRetargetNameFilter}
              onChange={setRewardRetargetNameFilter}
              options={retargetNameOptions.map((name) => ({ label: name, value: name }))}
            />
          </>
        )}
      </Space>
      <Table
        rowKey="id"
        dataSource={filteredRewardStats}
        columns={rewardColumns}
        pagination={false}
        bordered
        size="middle"
        style={{ marginBottom: 32 }}
      />

      <Divider />

      {/* 参与记录 */}
      <Title level={5}>参与记录</Title>
      <Form form={form} onFinish={handleSearch} style={{ marginBottom: 16 }}>
        <Row gutter={[16, 12]}>
          <Col span={4}>
            <Form.Item name="userId" label="用户编号" style={{ marginBottom: 0 }}>
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="nickname" label="昵称" style={{ marginBottom: 0 }}>
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="phone" label="手机号" style={{ marginBottom: 0 }}>
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="giftSendStatus" label="礼品发送状态" style={{ marginBottom: 0 }}>
              <Select placeholder="请选择" allowClear>
                <Select.Option value="已领取">已领取</Select.Option>
                <Select.Option value="未领取">未领取</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="messageSendStatus" label="消息发送状态" style={{ marginBottom: 0 }}>
              <Select placeholder="请选择" allowClear>
                <Select.Option value="已发放">已发放</Select.Option>
                <Select.Option value="未发放">未发放</Select.Option>
                <Select.Option value="已跳过">已跳过</Select.Option>
                <Select.Option value="执行中">执行中</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="stageFilter" label="触达阶段" style={{ marginBottom: 0 }}>
              <Select
                placeholder="全部"
                allowClear
                value={recordStageFilter}
                onChange={(val) => {
                  setRecordStageFilter(val)
                  form.setFieldValue('splitName', undefined)
                  form.setFieldValue('retargetName', undefined)
                }}
                options={[
                  { label: '首次触达', value: 'first' },
                  { label: '二次触达', value: 'second' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 12]} style={{ marginTop: 12 }}>
          <Col span={4}>
            {recordStageFilter === 'second' ? (
              <Form.Item name="retargetName" label="二次触达名称" style={{ marginBottom: 0 }}>
                <Select placeholder="请选择" allowClear>
                  {retargetNameOptions.map((name) => (
                    <Select.Option key={name} value={name}>{name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              <Form.Item name="splitName" label="分流组件名称" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            )}
          </Col>
          <Col span={4}>
            <Form.Item name="isControl" label="是否对照组" style={{ marginBottom: 0 }}>
              <Select placeholder="请选择" allowClear>
                <Select.Option value="是">是</Select.Option>
                <Select.Option value="否">否</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="dateRange" label="参与时间" style={{ marginBottom: 0 }}>
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={10} style={{ textAlign: 'right' }}>
            <Space>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button onClick={handleReset}>重置</Button>
              <Button icon={<DownloadOutlined />}>导出</Button>
            </Space>
          </Col>
        </Row>
      </Form>

      <Table
        rowKey="id"
        dataSource={filteredRecords}
        columns={recordColumns}
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
        bordered
        size="middle"
        scroll={{ x: isSecondStage ? 2000 : 1400 }}
      />
    </div>
  )
}

export default Statistics
