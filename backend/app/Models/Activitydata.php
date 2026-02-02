<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activitydata extends Model
{
    use HasFactory;

    protected $fillable = [
        'activity_date',
        'type',
        'description',
        'status',
        'lead_id',
        'customer_id',
        'project_id',
    ];

    public function lead()
    {
        return $this->belongsTo(LeadData::class, 'lead_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
}
