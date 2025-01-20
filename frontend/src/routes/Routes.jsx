import { Route } from "react-router-dom";
import { Movies } from "../pages/Movies";
import { MovieInfo } from "../pages/MovieInfo";

export const routes = (
  <>
    <Route path="/" element={<Movies />} />

    <Route path="/movie/:id" element={<MovieInfo />} />
  </>
);