require "test_helper"

class Api::V1::CouriersControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_couriers_index_url
    assert_response :success
  end

  test "should get show" do
    get api_v1_couriers_show_url
    assert_response :success
  end

  test "should get availability" do
    get api_v1_couriers_availability_url
    assert_response :success
  end

  test "should get confirm" do
    get api_v1_couriers_confirm_url
    assert_response :success
  end
end
