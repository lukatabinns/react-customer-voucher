import {Box, Search, StatefulTable} from "@bigcommerce/big-design";
import React, {useEffect, useState} from "react";

const CustomSearchTable = ({tableHeaders, tableData}) => {

    const key = 'id';
    const uniqueData = [...new Map(tableData.map(item =>
        [item[key], item])).values()];
    const [items, setItems] = useState(uniqueData);
    const [searchName, setSearchName] = useState('');
    const [searchCode, setSearchCode] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [searchOrderId, setSearchOrderId] = useState('');
    const [searchDateFrom, setSearchDateFrom] = useState('');
    const [searchDateTo, setSearchDateTo] = useState('');

    const onChangeName = (event) => {
        setSearchName(event.target.value);
        setItems((prevItems) => {
            return uniqueData;
        });
    };
    const onChangeCode = (event) => {
        setSearchCode(event.target.value);
        setItems((prevItems) => {
            return uniqueData;
        });
    };
    const onChangeEmail = (event) => {
        setSearchEmail(event.target.value);
        setItems((prevItems) => {
            return uniqueData;
        });
    };

    const onSubmit = (event) => {
        event.preventDefault();

        setItems((prevItems) => {

            if (searchName) {

                const lowerCased = searchName.toLowerCase();
                return prevItems.filter((item) => item.customer_surname.toLowerCase().includes(lowerCased));
            }else if(searchCode){

                const lowerCased = searchCode.toLowerCase();
                return prevItems.filter((item) => item.voucher_code.toLowerCase().includes(lowerCased));
            }else if(searchEmail){

                const lowerCased = searchEmail.toLowerCase();
                return prevItems.filter((item) => item.customer_email.toLowerCase().includes(lowerCased));
            }

            return uniqueData;
        });
    };

    return (
        <>
            <Box marginBottom="medium">
                <form onSubmit={onSubmit} id="voucher-search-form" method="POST">
                    <div className="row align-items-end">
                        <div className="col-3">
                            <label>Search by email</label>
                            <input type="text" name="email" className="form-control" onChange={onChangeEmail}/>
                        </div>
                        <div className="col-3">
                            <label>Search by surname</label>
                            <input type="text" name="surname" className="form-control" onChange={onChangeName}/>
                        </div>
                        <div className="col-3">
                            <label>Search by code</label>
                            <input type="text" name="code" className="form-control" onChange={onChangeCode}/>
                        </div>
                        <div className="col-2">
                            <button type="submit"  className="btn btn-outline-primary">
                                Search
                            </button>
                        </div>
                    </div>
                </form>
            </Box>
            <StatefulTable
                columns={tableHeaders}
                itemName="Customer Voucher Coupons"
                items={items}
                pagination
                stickyHeader
            />
        </>
    );
}
export default CustomSearchTable;
