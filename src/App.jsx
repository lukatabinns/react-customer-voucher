import logo from './logo.svg';
import React, { Component } from 'react';
import {Spinner} from './Utils/Spinner';
import Modal from './Utils/GenModal';
import {ApiService} from './Services/ApiService';
import { Inertia } from "@inertiajs/inertia";
import { Link, usePage } from "@inertiajs/inertia-react";
import {Button, GlobalStyles, Box, Panel, H2, Badge, Flex, FlexItem} from '@bigcommerce/big-design';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomSearchTable from "./Utils/CustomSearchTable";
import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCustomerVoucherLoading: false,
      showModal: false,
      redirect: false,
      id: 0,
      allCustomerVouchers: [],
      creditVal: null,
      name: null,
      hasRan: false,
      submitted: (this.props.location !== undefined && this.props.location.state !== null) ? this.props.location.state.isSubmitted : null,
      msgName: null,
      msgStat: null
    };

  }

  componentDidMount() {
    if(this.props.params !== undefined){
      this.loadCustomerVoucher(this.props.params.data);
    }
  }

  handleModal = (id, name, creditVal) => this.setState({ showModal: !this.state.showModal, id: id, name: name, creditVal: creditVal });

  tableHeaders = [
    {
      header: 'Customer surname',
      hash: 'customer_surname',
      render: ({ customer_surname }) => customer_surname
    },
    {
      header: 'Email',
      hash: 'customer_email',
      render: ({ customer_email }) => customer_email
    },
    {
      header: 'Code',
      hash: 'voucher_code',
      render: ({ voucher_code }) => voucher_code,
    },
    {
      header: "",
      hash: 'options',
      render: function (data) {
        return (
          <>
            <GlobalStyles />
            <span>
              <Button type="button" actionType="destructive" onClick={() => this.handleModal(data.id, data.voucher_code)}>Delete</Button>
            </span>
          </>
        );
      }.bind(this),
      align: 'right',
    },
  ];

  loadCustomerVoucher = (data) => {

    if (data !== null) {

      let bcStoreId = this.props.params.bc_store_id;

      sessionStorage.setItem('bc_store_id', bcStoreId);

      this.setState({
        isCustomerVoucherLoading: true,
        editStoreId: bcStoreId,
        allCustomerVouchers: data
      });

      if (this.props.params.msg !== null) {
        this.setState({
          msgName: this.props.params.msg.name,
          msgStat: this.props.params.msg.success,
        });
      }
    } else {
      this.setState({
        isCustomerVoucherLoading: true,
        allCustomerVouchers: []
      });
    }
  }

  hasCustomerVoucher() {
    return (this.state.allCustomerVouchers.length > 0);
  }

  deleteAllowance = (id, name) => {

    this.setState({ showModal: false, isCustomerVoucherLoading: false, allCustomerVouchers: [] });
    let bc_shop_id = sessionStorage.getItem('bc_store_id');
    Inertia.post('/delete-customer-allowance/' + id, { 'bc_shop_id': bc_shop_id },
      {
        onSuccess: () => {
          ApiService.allVoucherCoupon(bc_shop_id).then(response => {
            if (response.data.success) {
              toast.success('"' + name + '"' + " voucher coupon deleted");
              this.loadCustomerVoucher(response.data.data);
            } else {
              toast.error(response.data.msg);
            }
          }).catch((error) => {
            toast.error('Whoops!! something went wrong, try later', {
              position: "top-center",
              autoClose: 12000,
            });

            this.setState({
              isCustomerVoucherLoading: true
            });

            console.log(error.response.data);
          });
        }, onError: (errors) => {
          toast.error("Whoops!! customer ambassador allowance not updated. Try later", {
            position: "top-center",
            autoClose: 12000,
          });

        }
      });
  }

  renderRedirect = () => {
    this.setState({ isCustomerVoucherLoading: false });
    Inertia.get('/voucher-coupon/add');
  }

  render() {

    return (
      <div className="container-wrapper">
        <Box backgroundColor="secondary20" padding="medium" />

        <ToastContainer />

        {(!this.state.isCustomerVoucherLoading) ? <Spinner /> :
          <Box backgroundColor="secondary20" padding="medium" className="box-top">
            <Flex>
              <FlexItem flexGrow={2} flexOrder={1}>
                <H2>Customer Vouchers</H2>
              </FlexItem>
              <FlexItem flexOrder={4}>
                <Button type="button" onClick={this.renderRedirect} className="btn btn-danger">Connect Voucher</Button>
              </FlexItem>
            </Flex>

            <Panel>
              {
                this.hasCustomerVoucher()
                  ?
                  <section>
                    <div className="clear-bth"><CustomSearchTable tableHeaders={this.tableHeaders} tableData={this.state.allCustomerVouchers} /></div>
                  </section>
                  :
                  <section>
                    <div className="emptyTable">No customer voucher exist yet!</div>
                  </section>
              }
            </Panel>
          </Box>}
        <Modal handleModal={this.handleModal} isOpen={this.state.showModal} deleteAllowance={this.deleteAllowance} id={this.state.id} name={this.state.name} creditVal={this.state.creditVal} />
      </div>
    );
  }
}

export default App;
