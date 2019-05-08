import React, { Component } from 'react';

import { getArticlesByKeywords } from '../utilities/verbose_loaders';
import { createKeywordsQueryLink } from '../utilities/links_creators';
import BeautifulSearchForm from '../ReusableComponents/BeautifulSearchForm/BeautifulSearchForm';
import queryString from 'query-string';
import ArticlesQueryAdvancedOptions from './AdvancedOptions/ArticlesQueryAdvancedOptions';

import Spinner from '../ReusableComponents/Spinner';

class ArticlesQuery extends Component {
    state = {
        searchFormValue: "",
    }

    onSearchInputChange = e => {
        this.setState({searchFormValue: e.target.value});
    }

    onSearchSubmit = e => {
        e.preventDefault();
        console.log(this.state.searchFormValue);
    }

    onAdvancedSearchSubmit = ({filterByDomains, selectedDomains, filterByYears, yearsFilterBefore, yearsFilterAfter}) => {
        console.log(this.state.searchFormValue);
        console.log("by domains ", filterByDomains);
        console.log("selected: ", selectedDomains);
    }

    render() {
        const { searchFormValue } = this.state;
        return (
            <section>
                <BeautifulSearchForm 
                    value={searchFormValue} 
                    onInputChange={this.onSearchInputChange} 
                    onSubmit={this.onSearchSubmit}/>
                <div className="container" style={{display: "flex"}}>
                    <ArticlesQueryAdvancedOptions 
                        onSearchSubmit={this.onAdvancedSearchSubmit}/>
                    <div>
                        Ladyship it daughter securing procured or am moreover mr. Put sir she exercise vicinity cheerful wondered. Continual say suspicion provision you neglected sir curiosity unwilling. Simplicity end themselves increasing led day sympathize yet. General windows effects not are drawing man garrets. Common indeed garden you his ladies out yet. Preference imprudence contrasted to remarkably in on. Taken now you him trees tears any. Her object giving end sister except oppose. 

                        To sorry world an at do spoil along. Incommode he depending do frankness remainder to. Edward day almost active him friend thirty piqued. People as period twenty my extent as. Set was better abroad ham plenty secure had horses. Admiration has sir decisively excellence say everything inhabiting acceptance. Sooner settle add put you sudden him. 

                        Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected. Together gay feelings continue juvenile had off one. Unknown may service subject her letters one bed. Child years noise ye in forty. Loud in this in both hold. My entrance me is disposal bachelor remember relation. 

                        Possession her thoroughly remarkably terminated man continuing. Removed greater to do ability. You shy shall while but wrote marry. Call why sake has sing pure. Gay six set polite nature worthy. So matter be me we wisdom should basket moment merely. Me burst ample wrong which would mr he could. Visit arise my point timed drawn no. Can friendly laughter goodness man him appetite carriage. Any widen see gay forth alone fruit bed. 

                        May musical arrival beloved luckily adapted him. Shyness mention married son she his started now. Rose if as past near were. To graceful he elegance oh moderate attended entrance pleasure. Vulgar saw fat sudden edward way played either. Thoughts smallest at or peculiar relation breeding produced an. At depart spirit on stairs. She the either are wisdom praise things she before. Be mother itself vanity favour do me of. Begin sex was power joy after had walls miles. 

                        Placing assured be if removed it besides on. Far shed each high read are men over day. Afraid we praise lively he suffer family estate is. Ample order up in of in ready. Timed blind had now those ought set often which. Or snug dull he show more true wish. No at many deny away miss evil. On in so indeed spirit an mother. Amounted old strictly but marianne admitted. People former is remove remain as. 

                        An country demesne message it. Bachelor domestic extended doubtful as concerns at. Morning prudent removal an letters by. On could my in order never it. Or excited certain sixteen it to parties colonel. Depending conveying direction has led immediate. Law gate her well bed life feet seen rent. On nature or no except it sussex. 

                        Prevailed sincerity behaviour to so do principle mr. As departure at no propriety zealously my. On dear rent if girl view. First on smart there he sense. Earnestly enjoyment her you resources. Brother chamber ten old against. Mr be cottage so related minuter is. Delicate say and blessing ladyship exertion few margaret. Delight herself welcome against smiling its for. Suspected discovery by he affection household of principle perfectly he. 

                        Literature admiration frequently indulgence announcing are who you her. Was least quick after six. So it yourself repeated together cheerful. Neither it cordial so painful picture studied if. Sex him position doubtful resolved boy expenses. Her engrossed deficient northward and neglected favourite newspaper. But use peculiar produced concerns ten. 

                    </div>
                </div>
            </section>
        )
    }
}

export default ArticlesQuery;