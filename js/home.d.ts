export default Home;
/**
 * Component providing the main/home screen
 */
declare class Home {
    constructor(props: any);
    componentWillMount(): void;
    render(): any;
}
declare namespace Home {
    namespace contextTypes {
        let snackbar: any;
        let appbar: any;
    }
}
