<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LeadData extends Model
{
     use HasFactory;
     protected $table = 'lead_datas';
     protected $fillable = [
        'first_name',
        'last_name',
        'lead_assignee',
        'lead_status',
        'mobile',
        'email',
        'company_name',
        'industry_type',
        'lead_source',
        'website',
        'street',
        'city',
        'state',
        'country',
        'zip_code',
        'description',
    ];
}
