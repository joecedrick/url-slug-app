import React from 'react';
import styles from './add-url.module.css'
import { Button, Space, Input, Form, message } from 'antd';


type Props = {
  onSave: ()=>void
};

export default function AddUrl(props: Props) {

  const [form] = Form.useForm();
  const [submittable, setSubmittable] = React.useState<boolean>(false);
   const POST_LINK_URL = 'http://localhost:8000/links';

  const values = Form.useWatch([], form);

  React.useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

    const sendDataFailed = () => {
    message.error('Submit failed!');
  };

   async function sentToServer() {
    try {
     
    const response = await fetch(POST_LINK_URL, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
        },
      mode: 'cors', 
      body: JSON.stringify({"original_url": form.getFieldValue("url")})
    });

    if (!response.ok) {
        throw new Error('Something went wrong');
      }

      props.onSave();
  }
     catch (error) {
      console.log(error);
      } finally {
      }
  }

  return (
    <>
        <div className={styles.container}>
            <div className={styles.form}>
              <Form
                form={form}
                layout="vertical"
                onFinish={sentToServer}
                onFinishFailed={sendDataFailed}
                autoComplete="off"
              >
                <Form.Item
                  name="url"
                  label="Original URL"
                  rules={[
                    { required: true }, { type: 'url'},  
                    {
                      message: 'must be a http or https url!',
                      validator: (_, value) => {
                        if (/^(http|https):/.test(value)) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject('must be http or https url');
                        }
                      }
                    }
                  ]}
                >
                  <Input placeholder="input an url" />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" disabled={!submittable}>
                      Submit
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>
        </div>
    </>
  );
}