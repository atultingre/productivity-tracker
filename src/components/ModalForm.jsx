import React from 'react';
import { Modal, Button, Form as AntForm, Input } from 'antd';
import { Controller } from 'react-hook-form';

const ModalForm = ({ isModalVisible, handleOk, handleCancel, control, handleSubmit, reset }) => (
  <Modal
    title="HR Form"
    open={isModalVisible}
    onCancel={handleCancel}
    footer={null}
  >
    <AntForm layout="vertical" onFinish={handleSubmit(handleOk)}>
      <AntForm.Item label="Date">
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <Input
              type="date"
              {...field}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
      </AntForm.Item>
      <AntForm.Item label="File Name">
        <Controller
          name="fileName"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </AntForm.Item>
      <AntForm.Item label="Direct Dial">
        <Controller
          name="directDial"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </AntForm.Item>
      <AntForm.Item label="RPC VM">
        <Controller
          name="rpcVm"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </AntForm.Item>
      <AntForm.Item label="Company IVR">
        <Controller
          name="companyIvr"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </AntForm.Item>
      <AntForm.Item label="Not Verified">
        <Controller
          name="notVerified"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </AntForm.Item>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </AntForm>
  </Modal>
);

export default ModalForm;
