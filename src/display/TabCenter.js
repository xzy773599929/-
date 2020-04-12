import React from 'react'
import { Tab } from 'semantic-ui-react'
import SupportFundingTab from './supportFundingTab/SupportFundingTab';
import CreatorFundingTab from './creatorFundingTab/CreatorFundingTab';
import AllFundingTab from './allFundingTab/AllFundingTab';

const panes = [
    { menuItem: '所有众筹', render: () => <Tab.Pane><AllFundingTab/></Tab.Pane> },
    { menuItem: '我发起的', render: () => <Tab.Pane><CreatorFundingTab/></Tab.Pane> },
    { menuItem: '我参与的', render: () => <Tab.Pane><SupportFundingTab/></Tab.Pane> },
];

const TabCenter = () => <Tab panes={panes} />;

export default TabCenter