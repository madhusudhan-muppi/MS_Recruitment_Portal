import { NextResponse } from 'next/server';
import { connect, serializeFirestoreData } from '@/lib/db';
import { requireAdmin } from '@/lib/auth-guards';

export async function PATCH(req, { params }) {
    const { response } = await requireAdmin();
    if (response) return response;

    const { id } = params;
    const body = await req.json().catch(() => ({}));
    const { shortlisted } = body;

    if (typeof shortlisted !== 'boolean') {
        return NextResponse.json(
            { success: false, message: 'shortlisted must be a boolean' },
            { status: 400 }
        );
    }

    try {
        const db = await connect();
        const docRef = db.collection('formData').doc(id);

        const snapshot = await docRef.get();
        if (!snapshot.exists) {
            return NextResponse.json(
                { success: false, message: 'Applicant not found' },
                { status: 404 }
            );
        }

        await docRef.update({ shortlisted });

        const applicant = {
            id: snapshot.id,
            _id: snapshot.id,
            ...serializeFirestoreData({
                ...snapshot.data(),
                shortlisted,
            }),
        };

        return NextResponse.json({ success: true, data: applicant });
    } catch (error) {
        console.error('Error updating applicant:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update applicant' },
            { status: 500 }
        );
    }
}
