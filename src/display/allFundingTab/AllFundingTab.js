import React,{ Component } from 'react';
import { getFundingDetails, handleInvestFunc } from '../../eth/interaction';
import CardList from '../common/CardList';
import { Form, Dimmer, Label, Loader, Segment } from 'semantic-ui-react'

class AllFundingTab extends Component {

    state = {
        allFundingDetails : [],
        active : false,
        selectedFundingDetail : '',
    };

    async componentWillMount() {
        let allFundingDetails = await getFundingDetails(1);
        // console.table(allFundingDetails);
        this.setState({
            allFundingDetails,
        });
    }

    onItemClick = (selectedFundingDetail) => {
        console.log(selectedFundingDetail);
        this.setState({selectedFundingDetail : selectedFundingDetail})
    };

    //投资函数
    handleInvest = async () => {
        let {fundingAddress,creator, projectName, supportBalance, targetBalance, remainTime, currentBalance, investorsCount} = this.state.selectedFundingDetail;
        this.setState({active : true});
        try {
            let res = await handleInvestFunc(fundingAddress, supportBalance);
            this.setState({active : false})
        } catch (e) {
            console.log(e);
            this.setState({active : false})
        }
    };

    render(){
        return(
            <div>
                <CardList details={this.state.allFundingDetails} onItemClick={this.onItemClick}/>
                <div>
                    <h3>参与众筹</h3>
                    <Dimmer.Dimmable as={Segment} dimmed={this.state.active}>
                        <Dimmer	active={this.state.active} inverted>
                            <Loader>⽀持中</Loader>
                        </Dimmer>
                        <Form onSubmit={this.handleInvest}>
                            <Form.Input	type='text'	value={this.state.selectedFundingDetail.projectName} label='项⽬名称:'/>
                            <Form.Input	type='text'	value={this.state.selectedFundingDetail.fundingAddress} label='项⽬地址:'/>
                            <Form.Input	type='text'	value={this.state.selectedFundingDetail.supportBalance} label='⽀持⾦额:' labelPosition='left'>
                                <Label	basic>￥</Label>
                                <input/>
                            </Form.Input>
                            <Form.Button primary content='参与众筹'/>
                        </Form>
                    </Dimmer.Dimmable>
                </div>
            </div>

        )
    }
}

export default AllFundingTab;