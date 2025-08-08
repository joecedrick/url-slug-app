import { Button, Table, TableProps } from "antd";

interface DataType {
  id: string;
  slug: string;
  click_count: number;
  created_at: string;
  original_url: string;
}


const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Original Url',
    dataIndex: 'original_url',
    key: 'originalUrl',
    render: (text) => <Button type="link" onClick={(e) => {console.log("Clicked on", text); e.preventDefault();}} block>{text}</Button>,
  },
  {
    title: 'Slug',
    dataIndex: 'slug',
    key: 'slug',
    render: (text) => <p>{text}</p>,
  },
  {
    title: 'Click count',
    dataIndex: 'click_count',
    key: 'clickCount',
  },
  {
    title: 'Created at',
    dataIndex: 'created_at',
    key: 'createdAt',
    render: (text) => <p>{  new Date(text).toLocaleDateString() }</p>,
  },
];

type Props = {urls: [], loading: boolean, addClick: ({url, slug}: {url: string, slug: string})=>void};
const UrlList: React.FC<Props> = (props) => {
  if(props.loading)
    return <div>loading</div>
  return(
  <Table bordered 
  columns={columns} dataSource={props.urls}
  onRow={(i) => ({
    onClick: (e) => {
      e.preventDefault();
      props.addClick({url: i.original_url, slug: i.slug})
    }
        
})}
   />
)
};

export default UrlList;