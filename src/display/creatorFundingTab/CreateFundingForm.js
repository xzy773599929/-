import React, { Component } from 'react'
import { createFunding } from '../../eth/interaction'
import { Form, Dimmer, Label, Loader, Segment } from 'semantic-ui-react'

class CreateFundingForm extends Component {
    state = {
        active: false,
        projectName: '',
        supportBalance: '',
        targetBalance: '',
        duration: '',
    }
    //表单数据变化触发
    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    handleCreate = async () => {
        let { active, projectName, targetBalance, duration, supportBalance } = this.state;
        //校验输入数据是否为数字
        const r = /^\+?[1-9][0-9]*$/;
        if (!r.test(supportBalance + targetBalance + duration)) {
            alert('输入的不是数字!');
            return
        }
        this.setState({active:true})
        try {
            let res = await createFunding(projectName, targetBalance, duration, supportBalance)
            console.table(res);
            this.setState({active:false})
            alert('合约创建成功\n')
        } catch (e) {
            this.setState({active:false})
            console.log(e)
        }
    }

    render() {
        const { active, projectName, targetBalance, duration, supportBalance } = this.state;
        return (
            <div>
                <Dimmer.Dimmable as={Segment} dimmed={active}>
                    <Dimmer	active={active}	inverted>
                        <Loader>Loading</Loader>
                    </Dimmer>
                    <Form onSubmit={this.handleCreate}>
                        <Form.Input	required type='text' placeholder='项⽬名称'
                                       name='projectName'
                                       value={projectName}	label='项⽬名称:'
                                       onChange={this.handleChange}/><Form.Input required type='text' placeholder='⽀持⾦额' name='supportBalance' value={supportBalance}	label='⽀持⾦额:' labelPosition='left' onChange={this.handleChange}>
                        <Label	basic>￥</Label>
                        <input/>
                    </Form.Input>
                        <Form.Input	required type='text' placeholder='⽬标⾦额'
                                       name='targetBalance'	value={targetBalance}
                                       label='⽬标⾦额:'
                                       labelPosition='left'
                                       onChange={this.handleChange}>
                            <Label	basic>￥</Label>
                            <input/>
                        </Form.Input>
                        <Form.Input	required type='text' placeholder='⽬标⾦额'
                                       name='duration'	value={duration}
                                       label='众筹时间:'
                                       labelPosition='left'
                                       onChange={this.handleChange}>
                            <Label	basic>S</Label>
                            <input/>
                        </Form.Input>
                        <Form.Button primary content='创建众筹'/>
                    </Form>
                </Dimmer.Dimmable>
            </div>
        )
    }
}

export default CreateFundingForm