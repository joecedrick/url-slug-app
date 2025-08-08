import React, { useEffect, useState } from 'react';
import AddUrl from './features/url-slug/add-url';
import styles from './App.module.css'
import { Divider, Space } from 'antd';
import UrlList from './features/url-slug-list/url-list';


interface AppProps {
  message: string;
}


const App: React.FC<AppProps> = ({ message }) => {

  const [error, setError] = useState(null);
  const [urls, setUrls] = useState<[]>([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "http://localhost:8000";

    async function fetchAllUrls(): Promise<[]> {
    try {
      setLoading(true);
      
      // const response = await fetch(`${BASE_URL}/all`);


      const response = await fetch(`${BASE_URL}/all`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
      mode: 'cors', 
    });

      const data = await response.json();
      console.log("Fecht all Urls: ", data);
      return data;
    }
    catch(error) {
          setError(error);
      }finally{
        setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllUrls().then((data) => setUrls(data));
  }, []);

  function refreshData() {
    fetchAllUrls().then((data) => setUrls(data));
  };

  async function addClick({url, slug}: {url: string, slug: string}) {
    console.log("URL: ", url);
    console.log("SLUG: ", slug);

    try {
      setLoading(true);
      
      const response = await fetch(`${BASE_URL}/${slug}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
    });
      const data = await response.json();
      console.log("Response: ",data);
    }
    catch(error) {
          setError(error);
          console.log(error);
      }finally{
        refreshData();
        setLoading(false);
    }

  };

  return (
    <div className={styles.screenFiller}>
      <Space direction="vertical" align="center" style={{width: '100%', justifyContent: 'center'}}>
        <AddUrl onSave= {refreshData}/>
        <Divider style={{ borderColor: '#7cb305', borderWidth: '2px', width: '100%' }} />
        {!error && <UrlList urls={urls} loading ={loading} addClick={addClick} />}
      </Space>
    </div>
  );
};

export default App;
