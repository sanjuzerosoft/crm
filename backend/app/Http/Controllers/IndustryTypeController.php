<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\IndustryType;

class IndustryTypeController extends Controller
{
    public function index()
    {
        return IndustryType::all();
    }

    // 2️⃣ Store industry type
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:industry_types,name',
        ]);

        $type = IndustryType::create([
            'name' => $request->name,
            'status' => $request->status ?? 1
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Industry type created successfully',
            'data' => $type
        ]);
    }

    // 3️⃣ Get single industry type
    public function show($id)
    {

        return IndustryType::findOrFail($id);
    }

    // 4️⃣ Update industry type
    public function update(Request $request, $id)
    {
        $type = IndustryType::find($id);

        if (!$type) {
            return response()->json([
                'status' => false,
                'message' => 'Industry type not found'
            ], 404);
        }

        $request->validate([
            'name' => 'required|unique:industry_types,name,' . $id,
        ]);

        $type->update($request->only('name', 'status'));

        return response()->json([
            'status' => true,
            'message' => 'Industry type updated successfully',
            'data' => $type
        ]);
    }

    // 5️⃣ Delete industry type
    public function destroy($id)
    {
        $type = IndustryType::find($id);

        if (!$type) {
            return response()->json([
                'status' => false,
                'message' => 'Industry type not found'
            ], 404);
        }

        $type->delete();

        return response()->json([
            'status' => true,
            'message' => 'Industry type deleted successfully'
        ]);
    }
}
