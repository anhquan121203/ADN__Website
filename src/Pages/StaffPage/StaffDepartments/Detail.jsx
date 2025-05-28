import React from 'react';
import { Modal, Descriptions, Spin, Typography } from 'antd';
import moment from 'moment';

const { Text } = Typography;

const Detail = ({ department, visible, onClose, loading }) => {
  return (
    <Modal
      title="Department Details"
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
          <Descriptions.Item label="Department ID">
            <Text copyable>{department._id}</Text>
          </Descriptions.Item>
          
          <Descriptions.Item label="Name">
            {department.name}
          </Descriptions.Item>
          
          <Descriptions.Item label="Description">
            {department.description}
          </Descriptions.Item>
          
          <Descriptions.Item label="Manager">
            <div>
              <div>{`${department.manager_id.first_name} ${department.manager_id.last_name}`}</div>
              <Text type="secondary">{department.manager_id.email}</Text>
            </div>
          </Descriptions.Item>
          
          <Descriptions.Item label="Status">
            {department.is_deleted ? 'Deleted' : 'Active'}
          </Descriptions.Item>
          
          <Descriptions.Item label="Created At">
            {moment(department.created_at).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          
          <Descriptions.Item label="Updated At">
            {moment(department.updated_at).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <div>No department data available</div>
      )}
    </Modal>
  );
};

export default Detail;