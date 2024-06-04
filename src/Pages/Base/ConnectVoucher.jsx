import React, { Component } from 'react';
import { Inertia } from "@inertiajs/inertia";
import { Link, usePage } from "@inertiajs/inertia-react";
import {
    GlobalStyles,
    Form,
    FormGroup,
    Input,
    Box,
    Button,
    H2,
    Panel,
    Switch
} from '@bigcommerce/big-design';
import { ArrowBackIcon } from '@bigcommerce/big-design-icons';
import SimpleReactValidator from 'simple-react-validator';
import {ApiService} from "../Services/ApiService";
import { Oval, ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Spinner} from "../Utils/Spinner";

class ConnectVoucher extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            modelLoaded: false,
            serverError: '',
            submitLoader:false,
            name:'',
            surname:'',
            email:'',
            code:'',
            bcCustomerId:null,
            bcStoreId:null,
            creditValue:'',
            dayNumber:'',
            bck:false,
            error:false,
            active:true,
            searchCustomers:[],
            startSearch:false,
            startSearchCoupon:false,
            isSubmitted:null,
            inputVal:"",
            inputValCoupon:"",
            errorMsg:null,
            couponError:null,
            customerSearchNotFocus:false,
            couponSearchNotFocus:false,
            id:null,
            couponId:null,
            couponName:'',
            isSearchingCustomer:null,
            isSearchingVoucherCoupon:null,
            searchVoucherCoupon:[],
            msgName:null,
            msgStat:null,
            hasRan:false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.validator = new SimpleReactValidator();
        this._isMounted = false;
        this.dayNumMinMax = null;
    }

    componentDidMount() {
        this._isMounted = true;
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({ submitLoader: true, serverError: '', customerSearchNotFocus:false, couponSearchNotFocus:false});

        if (this.validator.allValid()) {

            if(this.state.isSearchingCustomer !== "hasSearched"){
                this.setState({ submitLoader: false, searchCustomers:[], isSearchingCustomer:"Please ensure that you are searching customer", errorMsg:null});
                return false;
            }else if(this.state.isSearchingVoucherCoupon !== "hasSearched"){
                this.setState({ submitLoader: false, searchCustomers:[], isSearchingVoucherCoupon:"Please ensure that you are searching voucher coupon", couponError:null});
                return false;
            }else {

                let connectVoucher = {
                    'bc_shop_id': this.state.bcStoreId,
                    'bc_customer_id': this.state.bcCustomerId,
                    'bc_voucher_id': this.state.couponId,
                    'customer_email':this.state.email,
                    'customer_surname':this.state.surname,
                    'voucher_name': this.state.couponName,
                    'voucher_code': this.state.code
                };

                Inertia.post('/store-voucher-coupon', connectVoucher,
                    {
                        onSuccess: (response) => {

                            this.setState({hasRan:false});
                        },
                        onError: (errors) => {
                            toast.error("Whoops!! Connect voucher not stored. Try later",{
                                position: "top-center",
                                autoClose: 12000,
                            });

                            this.setState({ submitLoader: false, hasRan:false});
                        }
                    });
            }
        } else {
            this.validator.showMessages();
            this.setState({ submitLoader: false, error:true });
            this.forceUpdate();
        }
    }

    autoSearch(txt){
        if(txt !== "") {

            this.setState({
                startSearch: true,
                errorMsg: null,
                searchCustomers: [],
                isSearchingCustomer:null,
            });

            ApiService.searchCustomers(txt).then(response => {
                if (response.status === 200) {
                    this.setState({
                        searchCustomers: response.data.data,
                        bcStoreId: response.data.bc_store_id,
                        startSearch: false,
                    });
                }
            }).catch((error) => {
                this.setState({
                    errorMsg: "No customers found",
                    startSearch: false
                });
            });
        }else{
            this.setState({
                errorMsg:"Please enter name / email",
            });
        }
    }

    autoSearchCoupon(txt){
        if(txt !== "") {

            this.setState({
                startSearchCoupon: true,
                couponError: null,
                searchVoucherCoupon:[],
                isSearchingVoucherCoupon:null
            });

            ApiService.searchVoucherCoupon(txt).then(response => {
                if (response.status === 200) {
                    this.setState({
                        searchVoucherCoupon: response.data.data,
                        bcStoreId: response.data.bc_store_id,
                        startSearchCoupon: false,
                    });
                }
            }).catch((error) => {
                this.setState({
                    couponError: "No coupons found",
                    startSearchCoupon: false
                });
            });
        }else{
            this.setState({
                couponError:"Please enter an id / code"
            });
        }
    }

    onChangeHandler (txt, val) {

        if(txt !== "" && txt.length > 0 && val === "customer") {

            this.setState({
                customerSearchNotFocus:false,
                searchCustomers: [],
                isSearchingCustomer:null,
                inputVal:txt,
            });

        }else if(txt !== "" && txt.length > 0 && val === "coupon"){
            this.setState({
                couponSearchNotFocus:false,
                searchVoucherCoupon: [],
                isSearchingVoucherCoupon:null,
                inputValCoupon:txt,
            });
        }else{
            this.setState({
                searchCustomers: [],
                searchVoucherCoupon: [],
                startSearch:false,
                startSearchCoupon:false,
                errorMsg:null,
                couponError:null,
                customerSearchNotFocus:false,
                couponSearchNotFocus:false
            });
        }

        if(val === "customer") {
            this.setState({
                inputVal: txt,
            });
        }else{
            this.setState({
                inputValCoupon: txt
            });
        }
    }

    onSearchHandler(txt, name, id, email, surname){
        this.setState({
            name: name,
            surname:surname,
            email:email,
            bcCustomerId:id,
            searchCustomers: [],
            startSearch:false,
            customerSearchNotFocus:true,
            inputVal:txt,
            isSearchingCustomer:"hasSearched"
        });
    }

    onSearchCouponHandler(txt, id, name, code){
        this.setState({
            searchVoucherCoupon: [],
            startSearchCoupon:false,
            customerSearchNotFocus:true,
            couponId:id,
            couponName:name,
            code:code,
            inputValCoupon:txt,
            isSearchingVoucherCoupon:"hasSearched"
        });
    }

    handleChange = (e) =>{
        this.setState({
            [e.target.name]: e.target.value,
            searchCustomers: [],
            searchVoucherCoupon: [],
            startSearch:false,
            startSearchCoupon:false,
            errorMsg:null,
            couponError:null,
            customerSearchNotFocus:false,
            couponSearchNotFocus:false,
        })
    }

    goBack = () => {
        this.setState({ bck: true});

        let bc_shop_id = sessionStorage.getItem('bc_store_id');

        Inertia.post('/go-back',{'bc_shop_id':bc_shop_id},{  onError: (errors) => {
                toast.error("Whoops!! something went wrong. Try later",{
                    position: "top-center",
                    autoClose: 12000,
                });
            }
        });
    }

    showMsg = () => {
        if(this.props.params.msg !== undefined && this.props.params.msg !== null){

            if(!this.state.hasRan) {

                this.state.submitLoader = false;
                toast.warning('"'+this.props.params.msg.name+'"'+" voucher coupon already assigned to this customer");
            }

            setTimeout(() => {
                this.state.hasRan = true;
            }, 2000);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        this.showMsg();
        let nme = this.validator.message('Name / Email', this.state.inputVal, 'required');
        let couponNme = this.validator.message('Code / ID', this.state.inputValCoupon, 'required');

        return (
            (this.state.bck)?<div>
                    <Box backgroundColor="secondary20" padding="xLarge" className="box-top"/>
                    <Spinner/>
                </div>: <div className="container-wrapper">
                <Box backgroundColor="secondary20" padding="medium"/>

                <ToastContainer />

                <GlobalStyles />

                <Box backgroundColor="secondary20" padding="medium" className="box-top">
                    <Box marginBottom="xLarge">
                        <div className="arrow-link crs arrow-link-width" onClick={() => this.goBack() }><div className="arrow-icon-sz"><ArrowBackIcon className="arrow-icon-sz"/></div> <div className="arrow-txt ps-2">back</div></div>
                    </Box>
                    <H2>Connect Voucher</H2>

                    <Panel>
                        <Form noValidate onSubmit = {this.handleSubmit}>
                            <FormGroup>
                                <Input id="name" name="name" placeholder="Search customer by email or name"
                                       type="text" iconRight={<div className="input-group-text crs" onClick={() => this.autoSearch(this.state.inputVal)}>
                                        <i className="fas fa-search"></i></div>}
                                       value={this.state.inputVal} error={(nme !== undefined && this.state.errorMsg === null)?nme.props.children:(this.state.isSearchingCustomer !== "hasSearched" && this.state.isSearchingCustomer !== null)?this.state.isSearchingCustomer:null} required label="Name / Email"
                                       onChange={e => this.onChangeHandler(e.target.value, "customer")} />
                            </FormGroup>

                            {(this.state.searchCustomers.length > 0)?<div className="search-usr-wrapper">
                                {this.state.searchCustomers.map((result, i) =>
                                    <div key={i}>
                                        <div className="search-usr crs" onClick={() => this.onSearchHandler(result.first_name+" "+result.last_name, result.first_name+" "+result.last_name, result.id, result.email, result.last_name)}>{result.first_name+" "+result.last_name}</div>
                                        <div className="search-usr crs" onClick={() => this.onSearchHandler(result.email, result.first_name+" "+result.last_name, result.id, result.email, result.last_name)}>{result.email}</div>
                                    </div>
                                )}
                            </div>:(this.state.startSearch)?<div className="search-usr crs text-center search-usr-wrapper"><Oval
                                    height={40}
                                    width={360}
                                    color="#3C64F4"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                    visible={true}
                                    ariaLabel='oval-loading'
                                    secondaryColor="#8e919c"
                                    strokeWidth={2}
                                    strokeWidthSecondary={2}

                                /></div>
                                :(this.state.errorMsg !== null && !this.state.customerSearchNotFocus)?<div className="search-usr crs text-center search-usr-wrapper">{this.state.errorMsg}</div>:null}

                            <FormGroup>
                                <Input id="code" name="code" placeholder="Search coupon by code or id"
                                       type="text" iconRight={<div className="input-group-text crs" onClick={() => this.autoSearchCoupon(this.state.inputValCoupon)}>
                                    <i className="fas fa-search"></i></div>}
                                       value={this.state.inputValCoupon} error={(couponNme !== undefined && this.state.couponError === null)?couponNme.props.children:(this.state.isSearchingVoucherCoupon !== "hasSearched" && this.state.isSearchingVoucherCoupon !== null)?this.state.isSearchingVoucherCoupon:null} required label="Code / ID"
                                       onChange={e => this.onChangeHandler(e.target.value, "coupon")} />
                            </FormGroup>

                            {(this.state.searchVoucherCoupon.length > 0)?<div className="search-usr-wrapper">
                                {this.state.searchVoucherCoupon.map((result, i) =>
                                    <div key={i}>
                                        <div className="search-usr crs" onClick={() => this.onSearchCouponHandler(result.code, result.id, result.name, result.code)}>{result.code}</div>
                                        <div className="search-usr crs" onClick={() => this.onSearchCouponHandler(result.id, result.id, result.name, result.code)}>{result.id}</div>
                                    </div>
                                )}
                            </div>:(this.state.startSearchCoupon)?<div className="search-usr crs text-center search-usr-wrapper"><Oval
                                    height={40}
                                    width={360}
                                    color="#3C64F4"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                    visible={true}
                                    ariaLabel='oval-loading'
                                    secondaryColor="#8e919c"
                                    strokeWidth={2}
                                    strokeWidthSecondary={2}

                                /></div>
                                :(this.state.couponError !== null && !this.state.couponSearchNotFocus)?<div className="search-usr crs text-center search-usr-wrapper">{this.state.couponError}</div>:null}

                            <Box marginTop="xxLarge">
                                <Button type="submit" disabled={this.state.submitLoader}>{(this.state.submitLoader)?<ThreeDots
                                    height={42}
                                    width={60}
                                    color="#ffffff"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                    visible={true}
                                    ariaLabel='three-dots-loading'
                                    secondaryColor="#8e919c"
                                    strokeWidth={2}
                                    strokeWidthSecondary={2}

                                />:"Save connection"}</Button>
                            </Box>
                        </Form>
                    </Panel>
                </Box>
            </div>
        )
    }
}

export default () => (
    <ConnectVoucher params={usePage().props} />
);
