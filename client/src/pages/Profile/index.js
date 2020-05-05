import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/api.hook';
import M from 'materialize-css/dist/js/materialize.min.js';
import moment from 'moment';
import get from 'lodash/get';

import Chart from '../../components/Chart';

const Profile = (props) => {
  const { apiCall, loading } = useApi();
  const [obmenkaData, setObmenkaData] = useState(null);
  const [obmenkaChartData, setObmenkaChartData] = useState(null);
  const [money24Data, setMoney24Data] = useState(null);
  const [money24ChartData, setMoney24ChartData] = useState(null);
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

  const formatDate = (data, func = setMoney24ChartData) => {
    const sell = data.map((r) => {
      return {
        x: moment.unix(r.date).format('MMM Do'),
        y: r.sell,
      };
    });
    const buy = data.map((r) => {
      return {
        x: moment.unix(r.date).format('MMM Do'),
        y: r.buy,
      };
    });

    func([
      { id: 'sell', color: 'hsl(174, 100%, 29%)', data: sell },
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

  useEffect(() => {
    if (obmenkaData) {
      formatDate(obmenkaData.USD, setObmenkaChartData);
    }
  }, [obmenkaData]);

  return (
    <div class="container">
      <h2 class="title">
        Курс валют{' '}
        <span class="teal-text right">
          USD / <span class="amber-text text-darken-1">UAH</span>
        </span>
      </h2>

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
                  {obmenkaData && obmenkaData.USD && obmenkaData.USD.length ? (
                    <>
                      <p class="right">
                        {moment.unix(obmenkaData.USD[obmenkaData.USD.length - 1].date).format('MMMM Do YYYY, H:mm')}
                      </p>
                      <h3 class="amber-text text-darken-1">
                        <span class="smallTitle grey-text text-darken-3">Покупка:</span>{' '}
                        {obmenkaData.USD[obmenkaData.USD.length - 1].buy}
                      </h3>
                      <h3 class="teal-text">
                        <span class="smallTitle grey-text text-darken-3">Продажа:</span>{' '}
                        {obmenkaData.USD[obmenkaData.USD.length - 1].sell}
                      </h3>
                    </>
                  ) : null}
                  <div style={{ height: 400 }}>{obmenkaChartData && <Chart data={obmenkaChartData} />}</div>
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
                  {money24Data && money24Data.USD && money24Data.USD.length ? (
                    <>
                      <p class="right">
                        {moment.unix(money24Data.USD[money24Data.USD.length - 1].date).format('MMMM Do YYYY, H:mm')}
                      </p>
                      <h3 class="amber-text text-darken-1">
                        <span class="smallTitle grey-text text-darken-3">Покупка:</span>{' '}
                        {money24Data.USD[money24Data.USD.length - 1].buy}
                      </h3>
                      <h3 class="teal-text">
                        <span class="smallTitle grey-text text-darken-3">Продажа:</span>{' '}
                        {money24Data.USD[money24Data.USD.length - 1].sell}
                      </h3>
                    </>
                  ) : null}
                  <div style={{ height: 400 }}>{money24ChartData && <Chart data={money24ChartData} />}</div>
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
