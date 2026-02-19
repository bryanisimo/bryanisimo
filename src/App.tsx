import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import Home from './pages/Home';
import JobDetail from './pages/JobDetail';
import Layout from './layouts/Layout';
import ScrollToTop from './components/ScrollToTop';

function App() {
    return (
        <ReactLenis root>
            <Router>
                <ScrollToTop />
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/experience/:id" element={<JobDetail />} />
                    </Routes>
                </Layout>
            </Router>
        </ReactLenis>
    );
}

export default App;
