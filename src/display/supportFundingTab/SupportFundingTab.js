import React,{ Component } from 'react';
import {getFundingDetails, showRequest, approveRequest} from '../../eth/interaction';
import CardList from '../common/CardList';
import {Button} from "semantic-ui-react";
import RequestTable from "../common/RequestTable";

class SupportFundingTab extends Component {

    state = {
        investorFundingDetails : [],
        selectedFundingDetail : '',
        requests : [],
    };

    async componentWillMount() {
        let investorFundingDetails = await getFundingDetails(3);
        // console.table(allFundingDetails);
        this.setState({
            investorFundingDetails,
        });
    }

    onItemClick = (selectedFundingDetail) => {
        console.log(selectedFundingDetail);
        this.setState({selectedFundingDetail : selectedFundingDetail})
    };

    onRequestDetailsClick = async () => {
        let fundingAddress = this.state.selectedFundingDetail.fundingAddress;
        try {
            let requests = await showRequest(fundingAddress);
            console.table('request details:',requests);
            this.setState({requests : requests})
        } catch (e) {
            console.log(e)
        }
    };

    handelApprove = async (index) => {
        console.log('处理投票操作',index)
        try {
            let res = await approveRequest(this.state.selectedFundingDetail.fundingAddress, index)
        } catch (e) {
            console.log(e)
        }
    };

    render(){
        return(
            <div>
                <CardList details={this.state.investorFundingDetails} onItemClick={this.onItemClick} />
                {
                    this.state.selectedFundingDetail && (
                        <div>
                            <Button color='google plus'	onClick={this.onRequestDetailsClick}>申请详情</Button>
                            <RequestTable requests={this.state.requests} handelApprove={this.handelApprove} investorsCount={this.state.selectedFundingDetail.investorsCount}/>
                        </div>
                    )
                }
            </div>
        )
    }
}

export default SupportFundingTab;