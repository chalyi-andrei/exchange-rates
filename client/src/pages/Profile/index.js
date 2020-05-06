import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/api.hook';
import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';

import Chart from '../../components/Chart';
import loader from '../../img/loader2.gif';

const formatDate = (data, func, format = 'MMM Do') => {
  const sell = data.map((r) => {
    return {
      x: moment.unix(r.date).format(format),
      y: r.sell,
    };
  });
  const buy = data.map((r) => {
    return {
      x: moment.unix(r.date).format(format),
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

const getFilterData = (data, data48) => {
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

  if (data48) {
    const twoDaysData = formatDate(cloneDeep(data48).reverse().slice(0, 16).reverse(), null, 'Do, HH: mm');
    const oneDayData = formatDate(cloneDeep(data48).reverse().slice(0, 8).reverse(), null, 'Do, HH: mm');
    filteredData.twoDays = [
      { id: 'sell', color: 'hsl(174, 100%, 29%)', data: twoDaysData.sell },
      { id: 'buy', color: 'hsl(84, 70%, 50%)', data: twoDaysData.buy },
    ];
    filteredData.oneDay = [
      { id: 'sell', color: 'hsl(174, 100%, 29%)', data: oneDayData.sell },
      { id: 'buy', color: 'hsl(84, 70%, 50%)', data: oneDayData.buy },
    ];
  }

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

      const filteredData = getFilterData(obmenkaResp.data.USD, obmenkaResp.data.data48h);
      setObmenkaFilterData(filteredData);
    }
  };

  const getMoney24Rate = async () => {
    const money24Resp = await apiCall('/api/rate/money24');
    if (money24Resp && money24Resp.data) {
      setMoney24Data(money24Resp.data);

      const filteredData = getFilterData(money24Resp.data.USD, money24Resp.data.data48h);
      setMoney24FilterData(filteredData);
    }
  };

  useEffect(() => {
    getObmenkaRate();
    getMoney24Rate();
  }, []);

  const renderRateData = (data, setFilterName) => {
    const className = 'waves-effect waves-light btn btn-small customBtn right';

    return data ? (
      <>
        <p className="right">{moment.unix(data[data.length - 1].date).format('MMMM Do YYYY, H:mm')}</p>
        <h3 className="amber-text text-darken-1">
          <span className="smallTitle grey-text text-darken-3">Покупка:</span> {data[data.length - 1].buy}
        </h3>
        <h3 className="teal-text">
          <span className="smallTitle grey-text text-darken-3">Продажа:</span> {data[data.length - 1].sell}
        </h3>

        <a className={className} onClick={() => setFilterName('oneDay')}>
          24 часа
        </a>
        <a className="waves-effect waves-light btn btn-small customBtn right" onClick={() => setFilterName('twoDays')}>
          48 часов
        </a>
        <a className="waves-effect waves-light btn btn-small customBtn right" onClick={() => setFilterName('week')}>
          Неделя
        </a>
        <a className="waves-effect waves-light btn btn-small customBtn right" onClick={() => setFilterName('twoWeeks')}>
          2 Недели
        </a>
        <a className="waves-effect waves-light btn btn-small customBtn right" onClick={() => setFilterName('month')}>
          Месяц
        </a>
      </>
    ) : null;
  };

  const renderLoader = () => (
    <div className="loader-wrapper">
      <img src={loader} className="loader center-align" />
    </div>
  );

  return (
    <div className="container my-container">
      <h2 className="title">
        Курс валют
        <span className="teal-text right">
          USD / <span className="amber-text text-darken-1">UAH</span>
        </span>
      </h2>

      <div className="row">
        <div className="col s12 ">
          <nav className="nav-extended" style={{ marginBottom: 20 }}>
            <div className="nav-content">
              <ul className="tabs">
                <li className={`${activeTab === 'khObmenka' ? 'teal lighten-2' : ''} tab`}>
                  <a
                    onClick={() => setActiveTab('khObmenka')}
                    className={`${activeTab === 'khObmenka' ? 'active white-text' : 'teal-text'}`}
                  >
                    Харьков Обменка
                  </a>
                </li>
                <li className={`${activeTab === 'money24' ? 'teal lighten-2' : ''} tab`}>
                  <a
                    onClick={() => setActiveTab('money24')}
                    className={`${activeTab === 'money24' ? 'active white-text' : 'teal-text'}`}
                  >
                    Money 24
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          {activeTab === 'khObmenka' && (
            <div className="col s12">
              {loading ? (
                renderLoader()
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
            <div className="col s12">
              {loading ? (
                renderLoader()
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
