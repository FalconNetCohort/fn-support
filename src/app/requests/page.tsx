'use client';

import { useSearchParams } from 'next/navigation';
import FeatureRequest from '../components/FeatureRequest';
import BugReport from '../components/BugReport';

const RequestsPage = () => {
    const searchParams = useSearchParams();
    const type = searchParams.get('type');

    return (
        <div>
            {type === 'feature' && <FeatureRequest />}
            {type === 'bug' && <BugReport />}
            {!type && <p>Please select an issue type from the menu.</p>}
        </div>
    );
};

export default RequestsPage;
