<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Customer extends Model
{
    use HasFactory;
    protected $table = 'customers';

    protected $fillable = [
        'first_name',
        'last_name',
        'customer_assignee',
        'customer_status',
        'mobile',
        'email',
        'company_name',
        'industry_type',
        'customer_source',
        'website',
        'street',
        'city',
        'state',
        'country',
        'zip_code',
        'description',
    ];
}
