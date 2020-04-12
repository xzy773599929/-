import React, { Component } from 'react'
import { createRequest } from '../../eth/interaction'
import { Form, Dimmer, Label, Loader, Segment } from 'semantic-ui-react'

class CreateRequestForm extends Component {
    state = {
        active: false,
        requestDesc : '',
        requestBalance : '',
        requestAddress : '',
    };
    //表单数据变化触发
    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    handleCreateRequest = async () => {
        let { active, requestDesc, requestBalance, requestAddress} = this.state;
        let fundingAddress = this.props.details.fundingAddress;
        //校验输入数据是否为数字
        const r = /^\+?[1-9][0-9]*$/;
        if (!r.test(requestBalance)) {
            alert('输入的不是数字!');
            return
        }
        this.setState({active:true})
        try {
            let res = await createRequest(fundingAddress, requestAddress, requestBalance, requestDesc)
            console.table(res);
            this.setState({active:false})
            alert('请求创建成功\n')
        } catch (e) {
            this.setState({active:false})
            console.log(e)
        }
    }

    render() {
        let {fundingAddress,creator, projectName, supportBalance, targetBalance, remainTime, currentBalance, investorsCount} = this.props.details;
        return (
            <div>
                <Dimmer.Dimmable as={Segment} dimmed={this.state.active}>
                    <Dimmer	active={this.state.active} inverted>
                        <Loader>处理中</Loader>
                    </Dimmer>
                <h3>发起付款请求</h3>
                <Segment>
                    <h4>当前项⽬:{projectName}</h4>
                    <h4>地址: {fundingAddress}</h4>
                    <Form onSubmit={this.handleCreateRequest}>
                        <Form.Input	type='text'	name='requestDesc'	required value={this.state.requestDesc} label='请求描述' placeholder='请求描述' onChange={this.handleChange}/>
                        <Form.Input	type='text'	name='requestBalance' required value={this.state.requestBalance} label='付款⾦额' labelPosition='left' placeholder='付款⾦额' onChange={this.handleChange}>
                            <Label	basic>￥</Label>
                            <input/>
                        </Form.Input>
                        <Form.Input	type='text'	name='requestAddress' required value={this.state.requestAddress} label='商家收款地址' labelPosition='left' placeholder='商家地址' onChange={this.handleChange}>
                            <Label	basic><span	role='img' aria-label='location'>♚</span></Label>
                            <input/>
                        </Form.Input>
                        <Form.Button primary content='开始请求'/>
                    </Form>
                </Segment>
                </Dimmer.Dimmable>
            </div>
        )
    }
}

export default CreateRequestForm