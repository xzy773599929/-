import React,{ Component } from 'react';
import {approveRequest, getFundingDetails, showRequest, finalizeRequest} from '../../eth/interaction';
import CardList from '../common/CardList';
import CreateFundingForm from "./CreateFundingForm";
import CreateRequestForm from './CreateRequestForm'
import RequestTable from '../common/RequestTable';
import { Button } from "semantic-ui-react";

class CreatorFundingTab extends Component {

    state = {
        creatorFundingDetails : [],
        selectedFundingDetail : '',
        requests : [],
    };

    async componentWillMount() {
        let creatorFundingDetails = await getFundingDetails(2);
        // console.table(allFundingDetails);
        this.setState({
            creatorFundingDetails,
        });
    }

    onItemClick = (selectedFundingDetail) => {
        console.log(selectedFundingDetail);
        this.setState({selectedFundingDetail : selectedFundingDetail})
    };

    onRequestDetailsClick = async () => {
        let fundingAddress = this.state.selectedFundingDetail.fundingAddress;
        try {
            let requests = await showRequest(fundingAddress)
            console.table('request details:',requests)
            this.setState({requests : requests})
        } catch (e) {
            console.log(e)
        }
    }

    handelFinalize = async (index) => {
        console.log('处理投票操作',index)
        try {
            let res = await finalizeRequest(this.state.selectedFundingDetail.fundingAddress, index)
        } catch (e) {
            console.log(e)
        }
    };

    render(){
        return(
            <div>
                <CardList details={this.state.creatorFundingDetails} onItemClick={this.onItemClick} />
                <CreateFundingForm/>
                <CreateRequestForm details={this.state.selectedFundingDetail}/>
                {
                    this.state.selectedFundingDetail && (
                        <div>
                            <Button color='google plus' onClick={this.onRequestDetailsClick}>申请详情</Button>
                            <RequestTable requests={this.state.requests} pagekey='2' handelFinalize={this.handelFinalize} investorsCount={this.state.selectedFundingDetail.investorsCount}/>
                        </div>
                    )
                }

            </div>
        )
    }
}

export default CreatorFundingTab;