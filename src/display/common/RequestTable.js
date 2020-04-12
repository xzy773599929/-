import React from 'react'
import { Table, Button } from 'semantic-ui-react'

const RequestTable = (props) => {

    let { requests, handelApprove, investorsCount, pagekey, handelFinalize } = props;
    //遍历requests，每一个request都生成一行表格
    let rowContainer = requests.map((request,i) => {
        return <RowInfo key={i} request={request} handelApprove={handelApprove} index={i} investorsCount={investorsCount} pagekey={pagekey} handelFinalize={handelFinalize}/>
    })

    return (
        <Table celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>花费描述</Table.HeaderCell>
                    <Table.HeaderCell>花费金额</Table.HeaderCell>
                    <Table.HeaderCell>商家地址</Table.HeaderCell>
                    <Table.HeaderCell>当前赞成人数</Table.HeaderCell>
                    <Table.HeaderCell>当前状态</Table.HeaderCell>
                    <Table.HeaderCell>操作</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
                {
                    rowContainer
                }
            <Table.Body>

            </Table.Body>
        </Table>
    );
}

let RowInfo = ( props ) => {
    let { request, handelApprove, index, investorsCount, pagekey, handelFinalize } = props
    let {0:purpose,1:cost,2:shopAddress,3:isVoted,4:voteCount,5:RequestStatus} = request
    console.table(request);
    return(
        <Table.Row>
            <Table.Cell>{purpose}</Table.Cell>
            <Table.Cell>{cost}</Table.Cell>
            <Table.Cell>{shopAddress}</Table.Cell>
            <Table.Cell>{voteCount}/{investorsCount}</Table.Cell>
            <Table.Cell>
                {
                    (RequestStatus == 2) ? (
                        '已完成'
                    ) : (
                        '投票中...'
                    )
                }
            </Table.Cell>
            <Table.Cell>
                {
                    (pagekey == 2) ? (
                        <Button onClick={() => handelFinalize(index)}>支付</Button>
                    ) : (
                        <Button onClick={() => handelApprove(index)}>赞成</Button>
                    )
                }

            </Table.Cell>
        </Table.Row>
    )
}

export default RequestTable
