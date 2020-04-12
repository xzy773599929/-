import React from 'react'
import {Card, Image, Progress, List} from 'semantic-ui-react'

const src = '/images/daniel.jpg';

const CardList = (props) => {
    let details = props.details;
    let onItemClick = props.onItemClick;

    let cards = details.map(detail => {
        return <CardFunding key={detail.fundingAddress} detail1={detail} onItemClick={onItemClick}/>
    });

    return (
        <Card.Group itemsPerRow={4}>
            {cards}
        </Card.Group>
    )
};

const CardFunding = (props) => {
    //由上面传递过来的detail
    let detail2 = props.detail1;
    let onItemClick = props.onItemClick;
    const {fundingAddress,creator, projectName, supportBalance, targetBalance, remainTime, currentBalance, investorsCount} = detail2;
    let percentage = (parseFloat(currentBalance)/parseFloat(targetBalance)).toFixed(2) * 100;
    return (
        <Card onClick={() => onItemClick && onItemClick(detail2)}>
            <Image src={src} wrapped ui={false}/>
            <Card.Content>
                <Card.Header>{projectName}</Card.Header>
                <Card.Meta>
                    <span className='date'>剩余时间:{remainTime}秒</span>
                    <Progress indicating percent={parseInt(percentage)} size='small' progress/>
                </Card.Meta>
                <Card.Description>-----不破不立-----</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <List divided horizontal style={{display: 'flex', justifyContent: 'space-around'}}>
                    <List.Item>
                        <List.Content>
                            <List.Header>已筹</List.Header>
                            <List.Description>{currentBalance/(10**18)}ETH</List.Description>
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>
                            <List.Header>已达</List.Header>
                            <List.Description>{parseInt(percentage)}%</List.Description>
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>
                            <List.Header>参与人数</List.Header>
                            <List.Description>{investorsCount}人</List.Description>
                        </List.Content>
                    </List.Item>
                </List>
            </Card.Content>
        </Card>
    )
}

export default CardList