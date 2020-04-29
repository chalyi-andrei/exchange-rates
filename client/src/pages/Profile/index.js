import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/api.hook';
import M from 'materialize-css/dist/js/materialize.min.js';
import moment from 'moment';

import Chart from '../../components/Chart';

const Profile = (props) => {
  const { apiCall, loading } = useApi();
  const [obmenkaData, setObmenkaData] = useState(null);
  const [money24Data, setMoney24Data] = useState(null);
  const [money24Data2, setMoney24Data2] = useState(null);
  const [activeTab, setActiveTab] = useState('khObmenka');

  const getObmenkaRate = async () => {
    const obmenkaResp = await apiCall('/api/rate/obmenka');
    if (obmenkaResp && obmenkaResp.data) {
      setObmenkaData(obmenkaResp.data);
    }
  };

  const getMoney24Rate = async () => {
    const money24Resp = await apiCall('/api/rate/money24');
    if (money24Resp && money24Resp.data) {
      setMoney24Data(money24Resp.data);
    }
  };

  const formatDate = (data) => {
    const sell = data.map((r) => {
      return {
        x: moment(r.date).format('MMM Do'),
        y: r.sell,
      };
    });
    const buy = data.map((r) => {
      return {
        x: moment(r.date).format('MMM Do'),
        y: r.buy,
      };
    });

    console.log('sell', sell);
    console.log('buy', buy);

    setMoney24Data2([
      { id: 'sell', color: 'hsl(84, 70%, 50%)', data: sell },
      { id: 'buy', color: 'hsl(84, 70%, 50%)', data: buy },
    ]);
  };

  useEffect(() => {
    getObmenkaRate();
    getMoney24Rate();
  }, []);

  useEffect(() => {
    if (money24Data) {
      formatDate(money24Data.USD);
    }
  }, [money24Data]);
  console.log('money24Data2', money24Data2);
  return (
    <div class="container">
      <h2>Курс валют</h2>
      <div class="row">
        <div class="col s12 ">
          <nav class="nav-extended" style={{ marginBottom: 20 }}>
            <div class="nav-content">
              <ul class="tabs">
                <li class={`${activeTab === 'khObmenka' ? 'teal lighten-2' : ''} tab`}>
                  <a
                    onClick={() => setActiveTab('khObmenka')}
                    class={`${activeTab === 'khObmenka' ? 'active white-text' : 'teal-text'}`}
                  >
                    Харьков Обменка
                  </a>
                </li>
                <li class={`${activeTab === 'money24' ? 'teal lighten-2' : ''} tab`}>
                  <a
                    onClick={() => setActiveTab('money24')}
                    class={`${activeTab === 'money24' ? 'active white-text' : 'teal-text'}`}
                  >
                    Money 24
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          {activeTab === 'khObmenka' && (
            <div class="col s12">
              {loading ? (
                'loading...'
              ) : (
                <>
                  <h4>Харьков обменка</h4>
                  {obmenkaData && obmenkaData.USD && obmenkaData.USD.length
                    ? obmenkaData.USD.map((r) => (
                        <>
                          <h5>{moment(r.date).format('MMMM Do YYYY, H:mm')}</h5>
                          <p>
                            Покупка: {r.buy ? r.buy : '-'} Продажа:{r.sell ? r.sell : '-'}
                          </p>
                        </>
                      ))
                    : null}
                </>
              )}
            </div>
          )}

          {activeTab === 'money24' && (
            <div class="col s12">
              {loading ? (
                'loading...'
              ) : (
                <>
                  <h4>Money24</h4>
                  {money24Data && money24Data.USD && money24Data.USD.length
                    ? money24Data.USD.map((r) => (
                        <>
                          <h5>{moment(r.date).format('Do MMMM YYYY')}</h5>
                          <p>
                            Покупка: {r.buy ? r.buy : '-'} Продажа:{r.sell ? r.sell : '-'}
                          </p>
                        </>
                      ))
                    : null}
                  <div style={{ height: 400 }}>{money24Data2 && <Chart data={money24Data2} />}</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
