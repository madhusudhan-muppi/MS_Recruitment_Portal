import { NextResponse } from 'next/server';
import { connect, serializeFirestoreData } from '@/lib/db';
import { requireAdmin } from '@/lib/auth-guards';

export async function PATCH(req, { params }) {
    const { response } = await requireAdmin();
    if (response) return response;

    const db = await connect();

    const { id } = params;
    const { shortlisted } = await req.json();

    try {
        const docRef = db.collection('formData').doc(id);
        await docRef.update({ shortlisted });
        const snapshot = await docRef.get();

        if (!snapshot.exists) {
            return NextResponse.json({ success: false, message: 'Applicant not found' }, { status: 404 });
        }

        const applicant = {
            id: snapshot.id,
            _id: snapshot.id,
            ...serializeFirestoreData(snapshot.data()),
        };

        return NextResponse.json({ success: true, data: applicant });
    } catch (error) {
        console.error('Error updating applicant:', error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}
