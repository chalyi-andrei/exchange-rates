import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/api.hook';
import M from 'materialize-css/dist/js/materialize.min.js';
import moment from 'moment';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';

import Chart from '../../components/Chart';

const formatDate = (data, func) => {
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

  if (func) {
    func([
      { id: 'sell', color: 'hsl(174, 100%, 29%)', data: sell },
      { id: 'buy', color: 'hsl(84, 70%, 50%)', data: buy },
    ]);
  } else {
    return { sell, buy };
  }
};

const getFilterData = (data) => {
  const weekData = formatDate(cloneDeep(data).reverse().slice(0, 7).reverse());
  const twoWeekData = formatDate(cloneDeep(data).reverse().slice(0, 14).reverse());
  const monthData = formatDate(cloneDeep(data).reverse().slice(0, 30).reverse());

  const filteredData = {
    week: [
      { id: 'sell', color: 'hsl(174, 100%, 29%)', data: weekData.sell },
      { id: 'buy', color: 'hsl(84, 70%, 50%)', data: weekData.buy },
    ],
    twoWeeks: [
      { id: 'sell', color: 'hsl(174, 100%, 29%)', data: twoWeekData.sell },
      { id: 'buy', color: 'hsl(84, 70%, 50%)', data: twoWeekData.buy },
    ],
    month: [
      { id: 'sell', color: 'hsl(174, 100%, 29%)', data: monthData.sell },
      { id: 'buy', color: 'hsl(84, 70%, 50%)', data: monthData.buy },
    ],
  };

  return filteredData;
};

const Profile = (props) => {
  const { apiCall, loading } = useApi();
  const [obmenkaData, setObmenkaData] = useState(null);
  const [obmenkaFilterData, setObmenkaFilterData] = useState(null);
  const [obmenkaFilterName, setObmenkaFilterName] = useState('week');

  const [money24Data, setMoney24Data] = useState(null);
  const [money24FilterData, setMoney24FilterData] = useState(null);
  const [money24FilterName, setMoney24FilterName] = useState('week');
  const [activeTab, setActiveTab] = useState('khObmenka');

  const getObmenkaRate = async () => {
    const obmenkaResp = await apiCall('/api/rate/obmenka');
    if (obmenkaResp && obmenkaResp.data) {
      setObmenkaData(obmenkaResp.data);

      const filteredData = getFilterData(obmenkaResp.data.USD);
      setObmenkaFilterData(filteredData);
    }
  };

  const getMoney24Rate = async () => {
    const money24Resp = await apiCall('/api/rate/money24');
    if (money24Resp && money24Resp.data) {
      setMoney24Data(money24Resp.data);

      const filteredData = getFilterData(money24Resp.data.USD);
      setMoney24FilterData(filteredData);
    }
  };

  useEffect(() => {
    getObmenkaRate();
    getMoney24Rate();
  }, []);

  const renderRateData = (data, setFilterName) => {
    return data ? (
      <>
        <p class="right">{moment.unix(data[data.length - 1].date).format('MMMM Do YYYY, H:mm')}</p>
        <h3 class="amber-text text-darken-1">
          <span class="smallTitle grey-text text-darken-3">Покупка:</span> {data[data.length - 1].buy}
        </h3>
        <h3 class="teal-text">
          <span class="smallTitle grey-text text-darken-3">Продажа:</span> {data[data.length - 1].sell}
        </h3>
        <a class="waves-effect waves-light btn btn-small customBtn right" onClick={() => {}}>
          24 часа
        </a>
        <a class="waves-effect waves-light btn btn-small customBtn right" onClick={() => {}}>
          48 часов
        </a>
        <a class="waves-effect waves-light btn btn-small customBtn right" onClick={() => setFilterName('week')}>
          Неделя
        </a>
        <a class="waves-effect waves-light btn btn-small customBtn right" onClick={() => setFilterName('twoWeeks')}>
          2 Недели
        </a>
        <a class="waves-effect waves-light btn btn-small customBtn right" onClick={() => setFilterName('month')}>
          Месяц
        </a>
      </>
    ) : null;
  };

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
                  {obmenkaData && obmenkaData.USD && obmenkaData.USD.length
                    ? renderRateData(obmenkaData.USD, setObmenkaFilterName)
                    : null}

                  <div style={{ height: 400 }}>
                    {obmenkaFilterData && <Chart data={obmenkaFilterData[obmenkaFilterName]} />}
                  </div>
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
                  {money24Data && money24Data.USD && money24Data.USD.length
                    ? renderRateData(money24Data.USD, setMoney24FilterName)
                    : null}
                  <div style={{ height: 400 }}>
                    {money24FilterData && <Chart data={money24FilterData[money24FilterName]} />}
                  </div>
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
