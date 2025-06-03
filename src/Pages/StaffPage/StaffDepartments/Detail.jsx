import React from 'react';
import { Modal, Descriptions, Spin, Typography } from 'antd';
import moment from 'moment';

const { Text } = Typography;

const Detail = ({ department, visible, onClose, loading }) => {
  return (
    <Modal
      title="Chi tiết phòng ban"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {loading ? (
        <div className="flex justify-center items-center p-12">
          <Spin size="large" />
        </div>
      ) : department ? (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Mã phòng ban">
            <Text copyable>{department._id}</Text>
          </Descriptions.Item>
          
          <Descriptions.Item label="Tên phòng ban">
            {department.name}
          </Descriptions.Item>
          
          <Descriptions.Item label="Mô tả">
            {department.description}
          </Descriptions.Item>
          
          <Descriptions.Item label="Quản lý">
            <div>
              <div>{`${department.manager_id.first_name} ${department.manager_id.last_name}`}</div>
              <Text type="secondary">{department.manager_id.email}</Text>
            </div>
          </Descriptions.Item>
          
          <Descriptions.Item label="Trạng thái">
            {department.is_deleted ? 'Đã xóa' : 'Đang hoạt động'}
          </Descriptions.Item>
          
          <Descriptions.Item label="Ngày tạo">
            {moment(department.created_at).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          
          <Descriptions.Item label="Ngày cập nhật">
            {moment(department.updated_at).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <div>Không có dữ liệu phòng ban</div>
      )}
    </Modal>
  );
};

export default Detail;