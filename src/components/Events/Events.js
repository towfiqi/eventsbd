import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header,  Right, Left, Button, Icon} from 'native-base';
import { StyleSheet, FlatList, Image, Text, View, ActivityIndicator } from 'react-native'; 
import { capitalize, getWeek, getLastDayOfMonth, getNextMonth } from '../../helpers/index';
import keys from '../../../keys';
import EventCard from './EventCard';
import SortModal from './SortModal';
import DateModal from './DateModal';

class Events extends Component {

    static navigationOptions = {
        header: null
    }
    constructor(props){
        super(props);

        this.state = {
            events:[], 
            count:0, 
            sortModalVisible: false, 
            dateModalVisible: false, 
            sortBy: 'recent', 
            dateBy:'all_time', 
            message: '',
            user_events:[],
            loadingMore:false
        }
    }

    componentWillMount(){
        //Check if User Favorite
        this.fetchEvents('fetch', this.state.sortBy, this.state.dateBy);
    }

    async componentDidMount(){
        const userEvents = this.props.userData.events;
        if(userEvents){
            this.setState({user_events: userEvents });
        }
        
        //Single Page test
        //this.props.navigation.navigate("Map");
        //Map Page Test
        // setTimeout( ()=> {
        //     this.props.navigation.navigate("UserEvents");
        // }, 2800);
        //console.log('Events Page UserData: ', this.props.userData);
    }

    _renderItem = ({item}) => {
        //Check if User Favorite
        var favorite = this.props.userData.events.length > 0 && this.props.userData.events.includes(item.id) ? true : false;
        return <EventCard event={item} navigation={this.props.navigation} favorite={favorite} />
    }

    _loadMore = () => {
        if(this.state.dateBy === 'today' || this.state.dateBy === 'tomorrow' || this.state.dateBy === 'this_week'){
            return
        }
        this.setState({loadingMore:true});
        this.fetchEvents('loadMore', this.state.sortBy, this.state.dateBy);
    }

    sortPopup = ()=> {
        this.setState({sortModalVisible: true});
    }
    sortChange = (value) => {
        this.setState({sortBy: value, events:[], sortModalVisible: false});
        this.fetchEvents('fetch', value, this.state.dateBy);
    }

    datePopup = () => {
        this.setState({dateModalVisible: true});
    }
    dateChange = (value) => {
        this.setState({dateBy: value, events:[], dateModalVisible: false});
        this.fetchEvents('fetch', this.state.sortBy, value);
    }
    closeModal = () => {
        console.log('Close Modal');
    }

    render(){
        //console.log(this.state);

        return(
            <Container style={styles.container}>
                <Header style={styles.header}>
                    <Left style={styles.headerLeft}>
                        <Image style={styles.logoHome} source={require('../../assets/logohome.png')} /><Text style={styles.tagline}> {this.state.count} </Text>
                    </Left>
                    <Right style={styles.headerRight}>
                        <Button style={styles.sortButton} transparent onPress={this.sortPopup}>
                            <Icon style={styles.sortIcon} name='ios-swap' />
                            <Text style={styles.sortText} uppercase={false}>{capitalize(this.state.sortBy)}</Text>
                        </Button>

                        <Button style={styles.dateButton} transparent onPress={this.datePopup.bind(this)}>
                            <Icon style={styles.dateIcon} name='ios-calendar-outline' />
                            <Text style={styles.dateText} uppercase={false}>{capitalize(this.state.dateBy)}</Text>
                        </Button>
                    </Right>

                </Header>

                        {this.state.message !== '' && 
                            <View style={styles.queryMessage}>
                                <Text style={styles.queryMessageText}>
                                    <Icon name="ios-infinite-outline" style={styles.queryMessageIcon} /> {this.state.message}
                                </Text>
                            </View>
                        }

                    {this.state.events.length === 0 && 
                        <View style={{flex:1, alignItems:'center'}}>
                            <ActivityIndicator size="large" color="#ccc" style={{marginTop: 220}} />
                        </View>
                    }

                    <FlatList
                        style={styles.content} 
                        data={this.state.events} 
                        extraData={this.props.userData} 
                        renderItem={this._renderItem}
                        keyExtractor={(item) => item.id}
                        onEndReachedThreshold={0.5}
                        onEndReached={this._loadMore}
                    />
                    {this.state.loadingMore === true && 
                        <View style={styles.loadingMore}>
                                <ActivityIndicator size="large" color="#fff" />
                        </View>
                    }
                <SortModal 
                visible={this.state.sortModalVisible} 
                sortChange={this.sortChange} 
                sortBy={this.state.sortBy}
                closeModal={this.closeModal} 
                />
                <DateModal 
                visible={this.state.dateModalVisible} 
                dateChange={this.dateChange} 
                dateBy={this.state.dateBy}
                closeModal={this.closeModal} 
                />
            </Container>
        );
    }

    fetchEvents = (mode='fetch', sort='recent', date='next_month') => {
        var skip = '';var order = 'start_time'; var query = ''; var limit = 5; var remove_old = '';
        if(mode === 'loadMore'){
            if(this.state.events.length < 1) { return; }
            skip = '&skip='+this.state.events.length;
        }
        if(sort === 'popular'){
            order = '-interested_count';
        }

        if( date === 'all_time'){
            remove_old = `&where={"end_time":{"$gte":{"__type":"Date","iso":"${new Date().toISOString()}"}}}`;
        }
        if(date === 'today' || date === 'tomorrow' || date === 'this_week'){  limit=100;   }
        if(date === 'today'){
            var qToday = new Date(); var qTodayYear = qToday.getFullYear(); var qTodayMonth = ("0" + (qToday.getMonth() + 1)).slice(-2); var qTodayDate =  ("0" + (qToday.getDate())).slice(-2); 
            query = `&where={"end_time":{"$gte":{"__type":"Date","iso":"${qTodayYear}-${qTodayMonth}-${qTodayDate}T23:00:00.000Z"}}, "start_time":{"$lte":{"__type":"Date","iso":"${qTodayYear}-${qTodayMonth}-${qTodayDate}T00:00:00.000Z"}}}`
        }
        if(date === 'tomorrow'){
            var qTomorrow = new Date(); 
            qTomorrow.setDate(qTomorrow.getDate() + 1);
            var qTomorrowYear = qTomorrow.getFullYear(); 
            var qTomorrowMonth = ("0" + (qTomorrow.getMonth() + 1)).slice(-2); 
            var qTomorrowDate = ("0" + (qTomorrow.getDate())).slice(-2);             
            query = `&where={"end_time":{"$gte":{"__type":"Date","iso":"${qTomorrowYear}-${qTomorrowMonth}-${qTomorrowDate}T23:00:00.000Z"}}, "start_time":{"$lte":{"__type":"Date","iso":"${qTomorrowYear}-${qTomorrowMonth}-${qTomorrowDate}T00:00:00.000Z"}}}`
        }
        if(date === 'this_week'){
            query = `&where={"end_time":{"$gte":{"__type":"Date","iso":"${new Date().toISOString()}"}}, "start_time":{"$lte":{"__type":"Date","iso":"${getWeek(new Date())[1]}"}}}`
        }

        if(date === 'this_month'){
            query = `&where={"end_time":{"$gte":{"__type":"Date","iso":"${new Date().toISOString()}"}}, "start_time":{"$lte":{"__type":"Date","iso":"${getLastDayOfMonth(new Date())}"}}}`
        }
        if(date === 'next_month'){
            query = `&where={"end_time":{"$gte":{"__type":"Date","iso":"${getNextMonth(new Date())[0]}"}}, "start_time":{"$lte":{"__type":"Date","iso":"${getNextMonth(new Date())[1]}"}}}`
        }

        var message;
        if(date === 'all_time' && sort === 'recent'){
            message =  `Showing ${sort === 'recent'? 'All':capitalize(sort)} Upcomming Events`;
        }else{
            message =  `Showing ${sort === 'recent'? 'All':capitalize(sort)} Events Happening ${capitalize(date)}`;
        }
        this.setState({ message:message });
        keys.apiKey, keys.appID
        fetch(`https://parseapi.back4app.com/classes/Events?limit=${limit}&count=1&order=`+order+query+skip+remove_old,{ 
            method:'get',
            headers : { 'Content-Type': 'application/x-www-form-urlencoded','X-Parse-REST-API-Key': keys.apiKey, 'X-Parse-Application-Id': keys.appID  }
            
        }).then((res)=> {
            const {results, count} =  JSON.parse(res._bodyInit);
            //console.log('Events Fetched: ', count);
            //var message;
            if(mode === 'loadMore'){
                let newevents = [...this.state.events, ...results];
                return this.setState({ events: newevents, loadingMore: false});
            }

            this.setState({ events: results, count: Number(count)});

            setTimeout(()=> {
                return this.setState({message:''})
            }, 5000);
            
        });
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#efede6'
    },
    content:{
        flex:1,
        padding: 10
    },
    header:{
        backgroundColor: '#fff',
        marginTop: 24,
        paddingTop: 30,
        paddingBottom: 30,
        elevation: 5
    },
    headerLeft:{
        flex:1,
        flexDirection: 'row'
    },
    logoHome:{
        resizeMode:'contain',
        width: 120,
        height:48
    },
    tagline:{
        color: '#777',
        fontSize: 11,
        fontWeight: 'bold',
        backgroundColor: '#f3f3f3',
        borderRadius: 10,
        paddingLeft: 6,
        paddingRight: 6,
        paddingTop: 2,
        paddingBottom: 2,
        marginTop: 12,
        marginLeft: 7
    },
    headerRight:{
        flex: 1,
        width: 120
    },
    sortButton:{
        flex: 1,
        flexDirection: 'column',
        marginTop: -6,
        marginLeft: 50,
        alignItems:'center',
        justifyContent:'center'
    },
    dateButton:{
        flex: 1,
        flexDirection: 'column',
        top: -5
        //marginTop: -6
    },
    sortIcon:{
        color: '#999',
        transform: [{ rotate: '90deg'}]
    },
    dateIcon:{
        color: '#999'
    },
    sortText:{
        fontSize: 10,
        fontWeight: 'normal',
        marginTop: 0,
        color: '#777'
    },
    dateText:{
        fontSize: 10,
        fontWeight: 'normal',
        marginTop: 0,
        color: '#777',
        width:55,
        textAlign:'center'
    },
    queryMessage:{
        backgroundColor: '#ebe8dd',
        padding: 10,
        flex:1,
        alignItems: 'center',
        maxHeight: 35,
        position: 'absolute',
        top:80,
        zIndex: 2,
        width:'100%'
    },
    queryMessageText:{
        fontSize: 13,
        color: '#767253',
        marginTop: -2,
    },
    queryMessageIcon:{
        fontSize: 18,
        color: '#767253',
        paddingTop:4,
    },
    loadingMore:{
        flex:1, 
        alignItems:'center',
        position:'absolute', 
        zIndex:3, 
        bottom: -25, 
        backgroundColor:'#e85c39', 
        borderRadius:100, 
        padding:4, 
        alignSelf:'center'
    }
});

const mapStateToProps = (state) => {
    return {
        userData: state.user
    }
}

export default connect(mapStateToProps, null)(Events);