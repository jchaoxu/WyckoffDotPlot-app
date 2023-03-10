import baostock as bs
import pandas as pd


def load_day_history(stock_code, start_date, current_date, precision, frequency) -> dict:
    #### 登陆系统 ####
    lg = bs.login()

    #### 获取历史K线数据 ####
    # 详细指标参数，参见“历史行情指标参数”章节
    rs = bs.query_history_k_data_plus(f"{stock_code}",
                                      "open,close, high, low",
                                      start_date=start_date, end_date=current_date,
                                      frequency=f"{frequency}", adjustflag="2")  # frequency="d"取日k线，adjustflag="3"默认不复权

    #### 打印结果集 ####
    data_list = []
    while (rs.error_code == '0') & rs.next():
        # 获取一条记录，将记录合并在一起
        rs_list = rs.get_row_data()
        for i in range(len(rs_list)):
            tmp = rs_list[i]
            # rs_list[i] = float(format(float(rs_list[i]), f'.{precision}f'))
            coefficient = float(100)
            rs_list[i] = float((float(tmp) * coefficient) // (precision * coefficient) * precision)
        data_list.append(rs_list)

    result = pd.DataFrame(data_list, columns=rs.fields)

    #### 登出系统 ####
    bs.logout()
    return result.to_dict()
